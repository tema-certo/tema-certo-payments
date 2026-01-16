import { Body, Container, Hr, Html, Img, Text } from '@react-email/components';
import * as React from 'react';
import imageBase64 from '~/templates/ImageBase64';

export default function PaymentComing({ name, value }) {
	return (
		<Html>
			<Body style={{ padding: '24px', borderRadius: '8px' }}>
				<Container style={{ padding: '24px' }}>
					<Img src={imageBase64} alt="Tema Certo - Logo" style={{ marginBottom: '8px' }} width={100} />
					<Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
						Olá {name}! Passando para avisar que sua próxima cobrança está agendada.
					</Text>
					<Text style={{ fontSize: '14px', color: '#555' }}>
						<Text>Valor: {value}</Text>
					</Text>
					<Hr />
					<Text>
						Tudo seguirá normalmente, sem necessidade de ação.
						Se quiser alterar ou cancelar sua assinatura, basta acessar sua conta.

						Qualquer dúvida, estamos por aqui.
					</Text>
					<Text>
						Atenciosamente,
						<Text>Tema Certo</Text>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}
