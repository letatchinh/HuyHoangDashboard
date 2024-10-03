import { Flex, Pagination } from 'antd';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { BASE_URL } from '~/constants/defaultValue';
import WhiteBox from './WhiteBox';
type PropsType = {
    src : string;
}
export default function PdfPreview({src} : PropsType) {
  
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
    
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  };

  return (
    src ? <WhiteBox >
      <Flex justify={'center'} align="center" vertical gap={5}>
      <Document className={'custom-pdf'} file={`${BASE_URL}api/image?pathFile=${src}`} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}/>
      </Document>
      <Pagination current={pageNumber} pageSize={1} total={numPages} size='small' onChange={(page) => setPageNumber(page)}/>
      </Flex>
    
    </WhiteBox> 
    : null
  );
}