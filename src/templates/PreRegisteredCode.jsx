import { Body, Container, Html, Img, Text } from '@react-email/components';
import * as React from 'react';
import { appConfig } from '~/config/app.config';
import imageBase64 from '~/templates/ImageBase64';

export default function PreRegisteredCodeEmail({ name, code }) {
	return (
		<Html>
			<Body style={{ padding: '24px', borderRadius: '8px' }}>
				<Container style={{ padding: '24px' }}>
					<Img src={imageBase64} alt="Tema Certo - Logo" style={{ marginBottom: '8px' }} width={100} />
					<Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
						Olá {name}! Seja bem-vindo(a) ao Tema Certo.
					</Text>
					<Text style={{ fontSize: '14px', color: '#555' }}>
						Utilize este código para acessar a plataforma:
						<br/>
						<h1>
							{code}
						</h1>
					</Text>
				</Container>
			</Body>
		</Html>
	)
}
