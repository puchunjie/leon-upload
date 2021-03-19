// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const handleImageToLeon = require('./utils/upload')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerTextEditorCommand('leonupload.choosedImage', async function () {
		// 获取狮子座配置参数
		const leonConfig = vscode.workspace.getConfiguration(
			"leon_upload_image"
		);
		const uri = await vscode.window.showOpenDialog({
			canSelectFolders: false,
			canSelectMany: false,
			filters: {
				images: ['png', 'jpg'],
			},
		})
		if (!uri) {
			return
		}
		const leonParams = {
			bucketName: leonConfig.bucket,
			apiUrl: leonConfig.domain,
			userToken: leonConfig.userToken,
			assetKey: leonConfig.accessKey,
			folder: leonConfig.folder || '/'
		}
		const localFile = uri[0].fsPath
		let { isOk, msg, url } = await handleImageToLeon(localFile, leonParams)
		if (isOk) {
			addImageUrlToEditor(url)
		} else {
			vscode.window.showErrorMessage(msg);
		}
	});

	context.subscriptions.push(disposable);
}

// 将图片链接写入编辑器
function addImageUrlToEditor(url) {
	let editor = vscode.window.activeTextEditor
	if (!editor) {
		return
	}
	// 替换内容
	const selection = editor.selection
	editor.edit((editBuilder) => {
		editBuilder.replace(selection, url)
	})
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
