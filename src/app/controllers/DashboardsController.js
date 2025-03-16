import Order from "../models/Order";
import { format } from 'date-fns';
class DashboardsController {
    async store(req, res) {
        try {
            // Dados dos cards do dashboard
            const orders = await Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalOrders: { 
                            $sum: 1 
                        },
                        totalOrdersValue: { $sum: "$payment.amount" },
                        successfulSales: { 
                            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
                        },
                        successfulSalesValue: { 
                            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$payment.amount", 0] }
                        }
                    }
                }
            ]);
            const ticketAverage = orders[0]?.successfulSalesValue / orders[0]?.successfulSales || 0;

            // Lista de pedidos
            const orderList = await Order.find().select(
                `_id 
                order_seller_id 
                createdAt 
                customer.name 
                customer.doc 
                status 
                payment.status 
                payment.method 
                payment.amount`
            ).sort({ createdAt: -1 });

            if (!orders || !orderList) {
                return res.status(401).json({
                    error: true,
                    message: 'Pedidos não encontrados.'
                });
            }
            // Formata o documento do cliente para CPF ou CNPJ
            const formatDocument = (doc) => {
                if (!doc) return '';
                if (doc.length === 11) {
                    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else if (doc.length === 14) {
                    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
                }
                return doc;
            };

            // Formata o status do pedido para exibir na tabela em português
            const formatOrderStatus = (status) => {
                const orders = {
                    paid: 'Pago',
                    pending: 'Pendente',
                    canceled: 'Cancelado'
                }
                return orders[status] || status;
            }

            // Formata o status do pagamento para exibir na tabela em português
            const formatPaymentStatus = (status) => {
                const payments = {
                    succeeded: 'Aprovado',
                    pending: 'Pendente',
                };
                return payments[status] || status;
            };

            // Formata o método de pagamento para exibir na tabela em português
            const formatPaymentMethod = (method) => {
                const methods = {
                    pix: 'Pix',
                    credit: 'Crédito',
                    credit_installments: 'Crédito Parcelado',
                    boleto: 'Boleto'
                };
                return methods[method] || method;
            };

            

            return res.status(200).json({
                ordersCards: {
                    totalOrders: orders[0]?.totalOrders || 0,
                    totalOrdersValue: orders[0]?.totalOrdersValue.toLocaleString('pt-br', { 
                        style: 'currency', currency: 'BRL' 
                    }) || 0,
                    successfulSales: orders[0]?.successfulSales || 0,
                    successfulSalesValue: orders[0]?.successfulSalesValue.toLocaleString('pt-br', {
                        style: 'currency', currency: 'BRL'
                    }) || 0,
                    ticketAverage: ticketAverage.toLocaleString('pt-br', {
                        style: 'currency', currency: 'BRL'
                    }) || 0
                },
                orderList: orderList.map(order => ({
                    orderId: order._id,
                    storeId: order.order_seller_id,
                    creation: format(new Date(order.createdAt), 'dd/MM/yyyy'),
                    customerName: order.customer.name,
                    customerDoc: formatDocument(order.customer.doc),
                    orderStatus: formatOrderStatus(order.status),
                    paymentStatus: formatPaymentStatus(order.payment.status),
                    paymentMethod: formatPaymentMethod(order.payment.method),
                    totalAmount: order.payment.amount.toLocaleString('pt-br', {
                        style: 'currency', currency: 'BRL'
                    }) || 0,
                })),
                totalOrders: orderList?.length
            });

        } catch (error) {
            return res.status(500).json({
            error: true,
            message: `Ops! Ocorreu um erro em nosso servidor. 
                Por favor, tente novamente ou contate o suporte.`
            });
        }
    }
}
export default new DashboardsController();