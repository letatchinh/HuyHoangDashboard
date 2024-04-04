import React from 'react'
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';
import 'react-reflex/styles.css'
export default function Reflex({LeftComponent, RightComponent}:{LeftComponent : React.JSX.Element, RightComponent : React.JSX.Element}) {
    return (
        <div className='reflexContainer'>
            <ReflexContainer orientation='vertical'>
                <ReflexElement 
                flex={0.15} // Set Width of Left component
                minSize={20} 
                maxSize={500} 
                className='reflexContainer--left'
                >
                    {LeftComponent}
                </ReflexElement>

                <ReflexSplitter className='reflexContainer--splitter'/>

                <ReflexElement className='reflexContainer--right'>
                    {RightComponent}
                </ReflexElement>
            </ReflexContainer>
        </div>
    )
}
