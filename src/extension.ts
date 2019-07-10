import * as path from 'path';
import * as vscode from 'vscode';

const open = require('open');

export function activate(context: vscode.ExtensionContext) {
	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	context.subscriptions.push(
		vscode.commands.registerCommand('extension.openNav', () => {
			currentPanel = vscode.window.createWebviewPanel(
				'font-awesome-icons', 
				'Font-Awesome icons',
				vscode.ViewColumn.One, 
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
				}
			);

			let scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'main.js'));
			let jsSource = scriptPath.with({scheme: 'vscode-resource'});
			
			currentPanel.webview.html = getWebViewContent(jsSource);
			
			currentPanel.webview.onDidReceiveMessage(
				async message => {
					if (message.openIconPage) {
						// vscode.env.openExternal(vscode.Uri.parse(message.openIconPage)).then(async (res) => {
						// 	if (!res) {
						// 	}
						// });
						await open(message.openIconPage);	
					}
				}
			);
		})
	);
}

export function deactivate() {}

let nonce = getNonce();

function getWebViewContent(sourceJs: object) {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>	
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://use.fontawesome.com; img-src vscode-resource: https:; script-src 'nonce-${nonce}'; style-src 'self' https://use.fontawesome.com">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
				<title>Nearest Icons from Font-Awesome</title>
			</head>
			<body>
				<main></main>
				<script nonce="${nonce}" type="text/javascript" src="${sourceJs}"></script>
			</body>
		</html>
	`;
}

function getNonce() {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}