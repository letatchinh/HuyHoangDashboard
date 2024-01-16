// import React from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import CustomEditor from 'ckeditor5-custom-build';
// import { BASE_URL } from '~/constants/defaultValue';
// import { filter} from 'lodash';

// interface PropsEditor {
//   value?: any,
//   onChange?: any,
//   onFocus?: any,
//   onBlur?: any,
//   blackList?: any
// };

// class MyUploadAdapter {
//   constructor(props: any) {
//     // CKEditor 5's FileLoader instance.
//     this.loader = props;
//     // URL where to send files.
//     this.url = `${BASE_URL}/api/v1/file/clinic`;
//   };

//   // Starts the upload process.
//   upload() {
//     return new Promise((resolve, reject) => {
//       this._initRequest();
//       this._initListeners(resolve, reject);
//       this._sendRequest();
//     });
//   }

//   // Aborts the upload process.
//   abort() {
//     if (this.xhr) {
//       this.xhr.abort();
//     }
//   }

//   // Example implementation using XMLHttpRequest.
//   _initRequest() {
//     const xhr = (this.xhr = new XMLHttpRequest());

//     xhr.open('POST', this.url, true);
//     xhr.responseType = 'json';
//     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
//     // xhr.setRequestHeader('Authorization', getToken());
//   }

//   // Initializes XMLHttpRequest listeners.
//   _initListeners(resolve: any, reject: any) {
//     const xhr = this.xhr;
//     const loader = this.loader;
//     const genericErrorText = `Couldn't upload file ${loader.file.name}.`;

//     xhr.addEventListener('error', () => reject(genericErrorText));
//     xhr.addEventListener('abort', () => reject());
//     xhr.addEventListener('load', () => {
//       const response = xhr.response;
//       if (!response || response.error) {
//         return reject(
//           response && response.error ? response.error.message : genericErrorText
//         );
//       }

//       // If the upload is successful, resolve the upload promise with an object containing
//       // at least the "default" URL, pointing to the image on the server.

//       resolve({
//         default: response.url
//       });
//     });

//     if (xhr.upload) {
//       xhr.upload.addEventListener('progress', (evt: any) => {
//         if (evt.lengthComputable) {
//           loader.uploadTotal = evt.total;
//           loader.uploaded = evt.loaded;
//         }
//       });
//     }
//   }

//   // Prepares the data and sends the request.
//   _sendRequest() {
//     const data = new FormData();

//     this.loader.file.then((result: any) => {
//       data.append('file', result);
//       this.xhr.send(data);
//     });
//   }
// }

// function MyCustomUploadAdapterPlugin(editor : any) {
//   editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
//     return new MyUploadAdapter(loader);
//   };
// };

// const Editor = ({ value, onChange,onFocus, onBlur,blackList = [] } : PropsEditor) => {
//   return (
//     <CKEditor
//       editor={CustomEditor}
//       config={{
//         extraPlugins: [MyCustomUploadAdapterPlugin],
//         toolbarCanCollapse: true,
//         toolbar: {
//           items: filter([
//             'heading',
//             '|',
//             'bold',
//             'italic',
//             'underline',
//             'strikethrough',
//             'code',
//             'subscript',
//             'superscript',
//             'link',
//             'bulletedList',
//             'numberedList',
//             'blockQuote',
//             'fontColor',
//             '|',
//             'alignment',
//             '|',
//             'imageInsert',
//             'mediaEmbed'
//           ],e => !blackList.includes(e)),
//           shouldNotGroupWhenFull: true
//         },

//         fontFamily: {
//           options: [
//             'default',
//             'Ubuntu, Arial, sans-serif',
//             'Ubuntu Mono, Courier New, Courier, monospace'
//           ]
//         },

//         alignment: {
//           options: ['left', 'right', 'center', 'justify']
//         },

//         image: {
//           styles: ['alignLeft', 'alignCenter', 'alignRight'],

//           // Configure the available image resize options.
//           resizeOptions: [
//             {
//               name: 'resizeImage:original',
//               label: 'Size gốc',
//               value: null
//             },
//             {
//               name: 'resizeImage:25',
//               label: '25%',
//               value: '25'
//             },
//             {
//               name: 'resizeImage:50',
//               label: '50%',
//               value: '50'
//             },
//             {
//               name: 'resizeImage:75',
//               label: '75%',
//               value: '75'
//             }
//           ],

//           toolbar: [
//             'imageStyle:alignLeft',
//             'imageStyle:alignCenter',
//             'imageStyle:alignRight',
//             '|',
//             'resizeImage',
//             '|',
//             'imageTextAlternative'
//           ]
//         },
//         mediaEmbed: {
//           previewsInData:true
//         },
//         heading: {
//           options: [
//             {
//               model: 'paragraph',
//               title: 'Paragraph',
//               class: 'ck-heading_paragraph'
//             },
//             {
//               model: 'heading1',
//               view: 'h1',
//               title: 'Heading 1',
//               class: 'ck-heading_heading1'
//             },
//             {
//               model: 'heading2',
//               view: 'h2',
//               title: 'Heading 2',
//               class: 'ck-heading_heading2'
//             },
//             {
//               model: 'heading3',
//               view: 'h3',
//               title: 'Heading 3',
//               class: 'ck-heading_heading2'
//             }
//           ]
//         }
//       }}
//       data={value}
//       onChange={(_, editor) => {
//         onChange(editor.getData());
//       }}
//       onFocus={onFocus??function(_, editor) {

//         console.log(editor)
//       }}
//       onBlur={onBlur??function(_, editor) {
//         console.log(editor)
//       }}
//     />
//   );
// };

// export default Editor;
