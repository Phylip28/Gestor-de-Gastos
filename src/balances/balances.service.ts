import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../trips/entities/trip.entity';
import { Expense } from '../expenses/entities/expense.entity';

// Servicio que calcula balances de gastos compartidos y genera transacciones de liquidación entre participantes
@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  // Calcula el balance individual de cada participante en un viaje sumando pagos realizados y restando gastos compartidos
  async getBalances(tripId: string, userId: string) {
    // Busca el viaje por ID incluyendo la lista de participantes para validar permisos
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['participants'],
    });

    // Lanza excepción HTTP 404 si el viaje no existe en la base de datos
    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // Verifica que el usuario autenticado sea participante del viaje antes de mostrar información financiera
    const isParticipant = trip.participants.some(p => p.id === userId);
    if (!isParticipant) {
      throw new BadRequestException('No eres parte de este viaje');
    }

    // Obtiene todos los gastos del viaje con información del pagador y personas con quienes se compartió
    const expenses = await this.expenseRepository.find({
      where: { trip: { id: tripId } },
      relations: ['payer', 'sharedWith'],
    });

    // Inicializa un objeto para almacenar el balance de cada participante comenzando en cero
    const balances = {};
    trip.participants.forEach(p => {
      balances[p.id] = { name: p.name, balance: 0 };
    });

    // Itera sobre cada gasto para calcular balances: suma el monto al pagador y resta la parte proporcional a cada beneficiario
    expenses.forEach(expense => {
      // Calcula cuánto debe pagar cada persona dividiendo el monto total entre número de beneficiarios
      const shareAmount = Number(expense.amount) / expense.sharedWith.length;
      
      // Incrementa el balance del pagador con el monto total del gasto
      balances[expense.payer.id].balance += Number(expense.amount);
      
      // Resta a cada beneficiario su parte proporcional del gasto
      expense.sharedWith.forEach(person => {
        balances[person.id].balance -= shareAmount;
      });
    });

    // Convierte el objeto de balances a un array con formato estandarizado redondeando a dos decimales
    return Object.entries(balances).map(([id, data]: [string, any]) => ({
      userId: id,
      name: data.name,
      balance: Math.round(data.balance * 100) / 100,
    }));
  }

  // Genera un plan óptimo de transacciones para liquidar todas las deudas del viaje minimizando el número de pagos
  async settleBalances(tripId: string, userId: string) {
    // Obtiene los balances actuales de todos los participantes para calcular las transacciones necesarias
    const balances = await this.getBalances(tripId, userId);

    // Separa participantes en deudores (balance negativo) y acreedores (balance positivo)
    const debtors = balances.filter(b => b.balance < 0);
    const creditors = balances.filter(b => b.balance > 0);

    // Array que almacenará las transacciones de pago necesarias para equilibrar las cuentas
    const transactions: { from: string; to: string; amount: number }[] = [];

    // Itera sobre cada deudor para asignar pagos a los acreedores hasta saldar su deuda
    debtors.forEach(debtor => {
      // Almacena el monto pendiente de pagar del deudor actual
      let remaining = Math.abs(debtor.balance);

      // Recorre los acreedores y asigna pagos mientras haya deuda pendiente
      creditors.forEach(creditor => {
        // Solo procesa si el deudor aún debe dinero y el acreedor tiene balance positivo
        if (remaining > 0 && creditor.balance > 0) {
          // Calcula el monto de la transacción como el mínimo entre lo que debe y lo que le deben
          const amount = Math.min(remaining, creditor.balance);
          
          // Registra la transacción de pago del deudor al acreedor
          transactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: Math.round(amount * 100) / 100,
          });

          // Reduce el monto restante por pagar del deudor
          remaining -= amount;
          // Reduce el monto que el acreedor aún debe recibir
          creditor.balance -= amount;
        }
      });
    });

    // Retorna mensaje de éxito con la lista de transacciones necesarias para liquidar el viaje
    return {
      message: 'Cálculo de equilibrio completado',
      transactions,
    };
  }
}