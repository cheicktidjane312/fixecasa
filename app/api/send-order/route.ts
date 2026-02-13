import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- CONFIGURAÇÃO ---
const SENDER_EMAIL = 'onboarding@resend.dev'; 
const COMPANY_EMAIL = 'cheicktidjane312@gmail.com'; 

// --- TIPOS ESTRITOS ---
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  address: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as OrderPayload;
    const { orderId, customerName, customerEmail, items, total, address } = body;

    if (!orderId || !customerEmail) {
      return NextResponse.json({ error: 'Dados em falta (ID ou Email)' }, { status: 400 });
    }

    const itemsHtml = items.map((item) => `
      <li style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong> <br/>
        <span style="color: #666;">Qtd: ${item.quantity} x ${item.price}€</span>
      </li>
    `).join('');

    // --- 1. ENVIO: EMAIL PARA O CLIENTE (Texte Modifié) ---
    const { error: errorClient } = await resend.emails.send({
      from: `FixeCasa <${SENDER_EMAIL}>`,
      to: [customerEmail],
      subject: `✅ Encomenda Recebida #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0f172a;">Obrigado, ${customerName}!</h1>
          <p>A sua encomenda foi registada com sucesso no nosso sistema.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0;">Resumo (#${orderId.slice(0, 8)})</h3>
            <ul style="list-style: none; padding: 0;">${itemsHtml}</ul>
            <p style="font-size: 18px; font-weight: bold; margin-top: 15px;">Total: ${Number(total).toFixed(2)}€</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
            <p><strong>Morada de Envio:</strong><br/>${address}</p>
          </div>

          <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; border: 1px solid #bae6fd; color: #0369a1;">
            <strong>ℹ️ PRÓXIMOS PASSOS:</strong><br/>
            Um dos nossos agentes entrará em contacto consigo brevemente (por telefone ou email) para <strong>confirmar a sua encomenda</strong> e fornecer os <strong>dados de pagamento</strong>.
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
            FixeCasa - Ferramentas Profissionais
          </p>
        </div>
      `,
    });

    if (errorClient) {
      console.error("❌ Erro ao enviar para o Cliente:", errorClient);
      // Note: En mode test (sans domaine), cela échouera si l'email client != email admin
    }

    // --- 2. ENVIO: EMAIL PARA A EMPRESA (ADMIN) ---
    const { error: errorAdmin } = await resend.emails.send({
      from: `FixeCasa Bot <${SENDER_EMAIL}>`,
      to: [COMPANY_EMAIL],
      subject: `💰 NOVA VENDA: ${Number(total).toFixed(2)}€ (Cliente: ${customerName})`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #16a34a;">💰 Nova Encomenda #${orderId.slice(0, 8)}</h2>
          
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <p><strong>Cliente:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p><strong>Morada:</strong> ${address}</p>
            <p><strong>Total a cobrar:</strong> ${Number(total).toFixed(2)}€</p>
            
            <h3>Itens vendidos:</h3>
            <ul>${itemsHtml}</ul>
          </div>
          
          <p>⚠️ <strong>Ação Necessária:</strong> Contacte o cliente para finalizar o pagamento.</p>
        </div>
      `,
    });

    if (errorAdmin) {
      console.error("❌ Erro ao enviar para o Admin:", errorAdmin);
      return NextResponse.json({ error: errorAdmin.message }, { status: 500 });
    }

    console.log("✅ Emails enviados com sucesso!");
    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("❌ Erro Interno do Servidor de Email:", errorMessage);
    return NextResponse.json({ error: 'Erro Interno do Servidor' }, { status: 500 });
  }
}