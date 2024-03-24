/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Code, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { DataFilter, HtmlComment } from '@ckeditor/ckeditor5-html-support';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';

import {
	AutoImage,
	Image,
	ImageCaption,
	ImageInsert,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	ImageResizeButtons,
	ImageResizeEditing,
	ImageResizeHandles,
} from '@ckeditor/ckeditor5-image';
import { Indent ,IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List ,TodoList} from '@ckeditor/ckeditor5-list';
import { MediaEmbed, AutoMediaEmbed, MediaEmbedToolbar } from '@ckeditor/ckeditor5-media-embed';
import { Mention } from '@ckeditor/ckeditor5-mention';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { GeneralHtmlSupport,FullPage } from '@ckeditor/ckeditor5-html-support';
// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editorv2 extends ClassicEditor {
	public static override builtinPlugins = [
		Alignment,
		AutoImage,
		GeneralHtmlSupport,
		Autoformat,
		BlockQuote,
		Bold,
		Strikethrough,
		Underline,
		CloudServices,
		Code,
		CodeBlock,
		DataFilter,
		Essentials,
		FindAndReplace,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		Heading,
		Highlight,
		HorizontalLine,
		HtmlComment,
		HtmlEmbed,
		Image,
		ImageCaption,
		ImageInsert,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		ImageResize,
		ImageResizeButtons,
		ImageResizeEditing,
		ImageResizeHandles,
		Indent,
		IndentBlock,
		Italic,
		Link,
		List,
		TodoList,
		MediaEmbed,
		AutoMediaEmbed,
		MediaEmbedToolbar,
		Mention,
		Paragraph,
		PasteFromOffice,
		Table,
		TableToolbar,
		TextTransformation,
		SourceEditing,
		FullPage,
	];

	public static override defaultConfig: EditorConfig = {
		toolbar: {
			items: [
				'undo',
				'redo',
				'heading',
				'alignment',
				'fontSize',
				'|',
				'sourceEditing',
				'|',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'link',
				{
					label:'font',
					icon:'<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="font"><path fill="#000000" d="M21,20H20V3a1,1,0,0,0-1-1H15.5a1,1,0,0,0-.86.5L4.43,20H3a1,1,0,0,0,0,2H7a1,1,0,0,0,0-2H6.74l3.5-6H18v6H17a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-3-8H11.41l4.66-8H18Z"></path></svg>',
					items:[
						'fontBackgroundColor',
						'fontColor',
						'fontFamily',
					],
					// withText:true,
				},

				{
					label: 'lists',
					icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="list-ul"><path fill="#000000" d="M3.71,16.29a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21,1,1,0,0,0-.21.33,1,1,0,0,0,.21,1.09,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1,1,0,0,0,.21-1.09A1,1,0,0,0,3.71,16.29ZM7,8H21a1,1,0,0,0,0-2H7A1,1,0,0,0,7,8ZM3.71,11.29a1,1,0,0,0-1.09-.21,1.15,1.15,0,0,0-.33.21,1,1,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21.94.94,0,0,0,.76,0,1.15,1.15,0,0,0,.33-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1,1,0,0,0,3.71,11.29ZM21,11H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2ZM3.71,6.29a1,1,0,0,0-.33-.21,1,1,0,0,0-1.09.21,1.15,1.15,0,0,0-.21.33.94.94,0,0,0,0,.76,1.15,1.15,0,0,0,.21.33,1.15,1.15,0,0,0,.33.21,1,1,0,0,0,1.09-.21,1.15,1.15,0,0,0,.21-.33.94.94,0,0,0,0-.76A1.15,1.15,0,0,0,3.71,6.29ZM21,16H7a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z"></path></svg>',
					items: ['bulletedList', 'numberedList', 'todoList'],
					// withText:true,
				  },
				'|',
				'imageUpload',
				'imageInsert',
				'mediaEmbed',
				'|',
				'blockQuote',
				'insertTable',
				'findAndReplace',
				'highlight',
				'horizontalLine',
				'-',
				'htmlEmbed',
				'outdent',
				'indent',
			],
			shouldNotGroupWhenFull: false
		},
		language: 'vi',
		image: {
			toolbar: [
				'imageTextAlternative',
				'resizeImage',
				'|',
				{
					name: 'imageStyle:customDropdown',
					title: 'Custom drop-down title',
					items: [ 
						'imageStyle:inline' ,
						'imageStyle:alignLeft' ,
						'imageStyle:alignRight' ,
						'imageStyle:alignCenter' ,
						'imageStyle:alignBlockLeft' ,
						'imageStyle:alignBlockRight' ,
						'imageStyle:block' ,
						'imageStyle:side' ,
					],
					defaultItem: 'imageStyle:alignLeft'
				}
				],	
			resizeUnit: "%",
			resizeOptions: [ {
					name: 'resizeImage:original',
					value: null,
					icon: 'original'
				},
				{
					name: 'resizeImage:25',
					value: '25',
					icon: 'small'
				},
				{
					name: 'resizeImage:50',
					value: '50',
					icon: 'medium'
				},
				{
					name: 'resizeImage:75',
					value: '75',
					icon: 'large'
				}
			],
			styles: {
				// Defining custom styling options for the images.
				options: [ 'inline', 'alignLeft', 'alignRight',
				'alignCenter', 'alignBlockLeft', 'alignBlockRight',
				'block', 'side'
				]
			},
		},
		mediaEmbed:{
			previewsInData:true,

			toolbar:[
				'mediaEmbed', // Nút chèn media embed
				'alignLeft',
				'alignRight',
				'alignCenter',
				'resizeImage:25',
				'resizeImage:50',
				'resizeImage:75',
				'resizeImage:original',
				'imageStyle:inline',
			],
		},
		fontSize:{
			options:[ 9, 11, 12, 14, 15, 16, 18, 19, 20, 22, 23, 24, 25, 27, 28, 29],
			supportAllValues: true
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		balloonToolbar: {
			items: ['bold', 'italic', 'undo', 'redo' ],
			shouldNotGroupWhenFull: true
		},
		htmlSupport:{
			allow:[
				{
					name: /.*/,
					attributes: true,
					classes: true,
					styles: true
				},
				{
					name: /^(div|section|article|style)$/,
					styles:true,
					attributes: true,
                    classes: true,
				},
		
			]
		},
	};
}

export default Editorv2;
