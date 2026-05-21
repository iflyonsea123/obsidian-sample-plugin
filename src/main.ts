import {App, Editor, MarkdownView, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, MyPluginSettings, SampleSettingTab} from "./settings";

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// Replace math delimiters icon in the left ribbon
		this.addRibbonIcon('function-square', 'Convert Math Delimiters', (evt: MouseEvent) => {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (activeView) {
				const editor = activeView.editor;
				this.convertMathDelimiters(editor);
			} else {
				new Notice('No active Markdown view to convert.');
			}
		});

		// Command to replace math delimiters
		this.addCommand({
			id: 'convert-math-delimiters',
			name: 'Convert Math Delimiters (LaTeX to Obsidian)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.convertMathDelimiters(editor);
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
	}

	convertMathDelimiters(editor: Editor) {
		const text = editor.getValue();
		
		let newText = text
			.replace(/\\\[/g, () => '$$')
			.replace(/\\\]/g, () => '$$')
			.replace(/\\\(/g, () => '$')
			.replace(/\\\)/g, () => '$');

		if (text !== newText) {
			editor.setValue(newText);
			new Notice('Math delimiters converted successfully!');
		} else {
			new Notice('No math delimiters found to convert.');
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MyPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

