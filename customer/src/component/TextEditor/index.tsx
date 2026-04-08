import { FC, memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { format_enum, format_type, Style_Options } from './type';
import { HandleFormat } from './handle/event/handleFormat';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import {
    BiBold,
    BiItalic,
    BiUnderline,
    BiStrikethrough,
    // BiAlignLeft,
    // BiAlignMiddle,
    // BiAlignRight,
    // BiAlignJustify,
    BiListUl,
    BiListOl,
    // BiLeftIndent,
    // BiRightIndent,
    // BiLink,
    // BiUnlink,
    // BiImage,
    // BiVideo,
} from 'react-icons/bi';

const TextEditor: FC<{ value?: string; onChange?: (value: string) => void }> = ({ value, onChange }) => {
    const parent_element = useRef<HTMLDivElement | null>(null);
    const btnContainer_element = useRef<HTMLDivElement | null>(null);
    const editor_element = useRef<HTMLDivElement | null>(null);
    const [isShowBtn, setIsShowBtn] = useState<boolean>(true);
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if (editor_element.current && value !== undefined) {
            editor_element.current.innerHTML = value;
        }
    }, [value]);

    useEffect(() => {
        if (!btnContainer_element.current) return;
        const btnContainerElement = btnContainer_element.current;

        if (isShowBtn) {
            btnContainerElement.classList.add(style.show);
        } else {
            btnContainerElement.classList.remove(style.show);
        }
    }, [isShowBtn]);

    const toggleText = (wrapperTag: string, style?: Style_Options) => {
        const handleFormat = new HandleFormat({
            editor_element: editor_element.current,
            wrapperTag: wrapperTag,
            style: style,
        });

        handleFormat.toggle();
    };

    const handleFormat = (cmd: format_type) => {
        switch (cmd) {
            case format_enum.BOLD: {
                toggleText('strong');
                break;
            }
            case format_enum.ITALIC: {
                toggleText('i');
                break;
            }
            case format_enum.UNDER_LINE: {
                toggleText('u');
                break;
            }
            case format_enum.STRIKE_THROUGH: {
                toggleText('del');
                break;
            }
            case format_enum.UNORDERED_LIST: {
                toggleText('li');
                break;
            }
            case format_enum.ORDERED_LIST: {
                toggleText('ol');
                break;
            }
            default: {
                //statements;
                break;
            }
        }

        if (editor_element.current?.innerHTML && onChange) {
            // setContent(editor_element.current.innerHTML); // hoặc .textContent nếu chỉ lấy text
            onChange(editor_element.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editor_element.current?.innerHTML && onChange) {
            // setContent(editor_element.current.innerHTML); // hoặc .textContent nếu chỉ lấy text
            onChange(editor_element.current.innerHTML);
        }
    };

    // const handleFile = (e: React.ChangeEvent<HTMLSelectElement>) => {};

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.header}>
                <div className={style.btnContainer} ref={btnContainer_element}>
                    <div className={style.formats}>
                        <div className={style.format} onClick={() => handleFormat(format_enum.BOLD)}>
                            <BiBold size={25} />
                        </div>
                        <div className={style.format} onClick={() => handleFormat(format_enum.ITALIC)}>
                            <BiItalic size={25} />
                        </div>
                        <div className={style.format} onClick={() => handleFormat(format_enum.UNDER_LINE)}>
                            <BiUnderline size={25} />
                        </div>
                        <div className={style.format} onClick={() => handleFormat(format_enum.STRIKE_THROUGH)}>
                            <BiStrikethrough size={25} />
                        </div>
                    </div>
                    <div className={style.formats}>
                        {/* <button onClick={() => handleFormat(format_enum.LEFT)}>
                        <BiAlignLeft size={25} />
                    </button> */}
                        {/* <button onClick={() => handleFormat('justifyCenter')}>
                        <BiAlignMiddle size={25} />
                    </button>
                    <button onClick={() => handleFormat('justifyRight')}>
                        <BiAlignRight size={25} />
                    </button>
                    <button onClick={() => handleFormat('justifyFull')}>
                        <BiAlignJustify size={25} />
                    </button> */}
                    </div>
                    <div className={style.formats}>
                        <div className={style.format} onClick={() => handleFormat(format_enum.UNORDERED_LIST)}>
                            <BiListUl size={25} />
                        </div>
                        <div className={style.format} onClick={() => handleFormat(format_enum.ORDERED_LIST)}>
                            <BiListOl size={25} />
                        </div>
                    </div>
                    <div className={style.formats}>
                        {/* <button onClick={() => handleFormat('indent')}>
                        <BiLeftIndent size={25} />
                    </button>
                    <button onClick={() => handleFormat('outdent')}>
                        <BiRightIndent size={25} />
                    </button> */}
                    </div>
                    <input
                        className="TextEditor-filename"
                        type="text"
                        placeholder="File name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                    {/* <select className="te-formats select" defaultValue={'0'} onChange={(e) => handleFile(e)}>
                    <option value="">File</option>
                    <option value="new">New file</option>
                    <option value="txt">Save as txt</option>
                    <option value="pdf">Save as pdf</option>
                </select>
                <select className="te-formats select" defaultValue={'0'} onChange={(e) => handleFormat('fontSize', e)}>
                    <option value="0">Font size</option>
                    <option value="1">Extra small</option>
                    <option value="2">Small</option>
                    <option value="3">Regular</option>
                    <option value="4">Medium</option>
                    <option value="5">Large</option>
                    <option value="6">Extra Large</option>
                    <option value="7">Big</option>
                </select>
                <select
                    className="te-formats select"
                    defaultValue={'0'}
                    onChange={(e) => handleFormat('formatBlock', e)}
                >
                    <option value="0">Format</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                    <option value="p">Paragraph</option>
                </select> */}
                    {/* <span className="te-formats">
                    <button onClick={() => handleFormat('createLink', prompt('Insert url'))}>
                        <BiLink size={25} />
                    </button>
                    <button onClick={() => handleFormat('unlink')}>
                        <BiUnlink size={25} />
                    </button>
                    <button onClick={() => handleFormat('insertImage', prompt('Insert url image'))}>
                        <BiImage size={25} />
                    </button>
                    <button onClick={() => handleFormat('insertIframe', prompt('Insert url image'))}>
                        <BiVideo size={25} />
                    </button>
                </span>
                <span className="te-formats">
                    <span>Color</span>
                    <input type="color" onInput={(e) => handleFormat('foreColor', e)} defaultValue={'#000000'} />
                </span>
                <span className="te-formats">
                    <span>Background</span>
                    <input type="color" onInput={(e) => handleFormat('hiliteColor', e)} defaultValue={'#000000'} />
                </span> */}
                </div>
                <div className={style.showBtnContainer}>
                    {isShowBtn && <FaChevronUp onClick={() => setIsShowBtn(false)} />}
                    {!isShowBtn && <FaChevronDown onClick={() => setIsShowBtn(true)} />}
                </div>
            </div>
            <div
                className={style.content}
                ref={editor_element}
                data-gramm="false"
                suppressContentEditableWarning
                contentEditable={true}
                spellCheck={false}
                onInput={handleInput}
            >
                <br />
            </div>
        </div>
    );
};

export default memo(TextEditor);

// import { useState, useRef } from 'react';
// import style from './style.module.scss';
// import { format_enum, format_type, Style_Options } from './type';
// import { HandleFormat } from './handle/event/handleFormat';

// import {
//     BiBold,
//     BiItalic,
//     BiUnderline,
//     BiStrikethrough,
//     // BiAlignLeft,
//     // BiAlignMiddle,
//     // BiAlignRight,
//     // BiAlignJustify,
//     BiListUl,
//     BiListOl,
//     // BiLeftIndent,
//     // BiRightIndent,
//     // BiLink,
//     // BiUnlink,
//     // BiImage,
//     // BiVideo,
// } from 'react-icons/bi';

// const TextEditor = () => {
//     const parent_element = useRef<HTMLDivElement | null>(null);
//     const editor_element = useRef<HTMLDivElement | null>(null);
//     const [fileName, setFileName] = useState('');

//     const toggleText = (wrapperTag: string, style?: Style_Options) => {
//         const handleFormat = new HandleFormat({
//             editor_element: editor_element.current,
//             wrapperTag: wrapperTag,
//             style: style,
//         });

//         handleFormat.toggle();
//     };

//     const handleFormat = (
//         cmd: format_type
//         // e?: React.ChangeEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement> | string | null
//     ) => {
//         switch (cmd) {
//             case format_enum.BOLD: {
//                 toggleText('strong');
//                 break;
//             }
//             case format_enum.ITALIC: {
//                 toggleText('i');
//                 break;
//             }
//             case format_enum.UNDER_LINE: {
//                 toggleText('u');
//                 break;
//             }
//             case format_enum.STRIKE_THROUGH: {
//                 toggleText('del');
//                 break;
//             }
//             case format_enum.UNORDERED_LIST: {
//                 toggleText('li');
//                 break;
//             }
//             case format_enum.ORDERED_LIST: {
//                 toggleText('ol');
//                 break;
//             }
//             default: {
//                 //statements;
//                 break;
//             }
//         }
//     };

//     // const handleFile = (e: React.ChangeEvent<HTMLSelectElement>) => {};

//     return (
//         <div className={style.parent} ref={parent_element}>
//             <div className="TextEditor-header">
//                 <span className="te-formats">
//                     <button onClick={() => handleFormat(format_enum.BOLD)}>
//                         <BiBold size={25} />
//                     </button>
//                     <button onClick={() => handleFormat(format_enum.ITALIC)}>
//                         <BiItalic size={25} />
//                     </button>
//                     <button onClick={() => handleFormat(format_enum.UNDER_LINE)}>
//                         <BiUnderline size={25} />
//                     </button>
//                     <button onClick={() => handleFormat(format_enum.STRIKE_THROUGH)}>
//                         <BiStrikethrough size={25} />
//                     </button>
//                 </span>
//                 <span className="te-formats">
//                     {/* <button onClick={() => handleFormat(format_enum.LEFT)}>
//                         <BiAlignLeft size={25} />
//                     </button> */}
//                     {/* <button onClick={() => handleFormat('justifyCenter')}>
//                         <BiAlignMiddle size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('justifyRight')}>
//                         <BiAlignRight size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('justifyFull')}>
//                         <BiAlignJustify size={25} />
//                     </button> */}
//                 </span>
//                 <span className="te-formats">
//                     <button onClick={() => handleFormat(format_enum.UNORDERED_LIST)}>
//                         <BiListUl size={25} />
//                     </button>
//                     <button onClick={() => handleFormat(format_enum.ORDERED_LIST)}>
//                         <BiListOl size={25} />
//                     </button>
//                 </span>
//                 <span className="te-formats">
//                     {/* <button onClick={() => handleFormat('indent')}>
//                         <BiLeftIndent size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('outdent')}>
//                         <BiRightIndent size={25} />
//                     </button> */}
//                 </span>
//                 <input
//                     className="TextEditor-filename"
//                     type="text"
//                     placeholder="File name"
//                     value={fileName}
//                     onChange={(e) => setFileName(e.target.value)}
//                 />
//                 {/* <select className="te-formats select" defaultValue={'0'} onChange={(e) => handleFile(e)}>
//                     <option value="">File</option>
//                     <option value="new">New file</option>
//                     <option value="txt">Save as txt</option>
//                     <option value="pdf">Save as pdf</option>
//                 </select>
//                 <select className="te-formats select" defaultValue={'0'} onChange={(e) => handleFormat('fontSize', e)}>
//                     <option value="0">Font size</option>
//                     <option value="1">Extra small</option>
//                     <option value="2">Small</option>
//                     <option value="3">Regular</option>
//                     <option value="4">Medium</option>
//                     <option value="5">Large</option>
//                     <option value="6">Extra Large</option>
//                     <option value="7">Big</option>
//                 </select>
//                 <select
//                     className="te-formats select"
//                     defaultValue={'0'}
//                     onChange={(e) => handleFormat('formatBlock', e)}
//                 >
//                     <option value="0">Format</option>
//                     <option value="h1">Heading 1</option>
//                     <option value="h2">Heading 2</option>
//                     <option value="h3">Heading 3</option>
//                     <option value="h4">Heading 4</option>
//                     <option value="h5">Heading 5</option>
//                     <option value="h6">Heading 6</option>
//                     <option value="p">Paragraph</option>
//                 </select> */}
//                 {/* <span className="te-formats">
//                     <button onClick={() => handleFormat('createLink', prompt('Insert url'))}>
//                         <BiLink size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('unlink')}>
//                         <BiUnlink size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('insertImage', prompt('Insert url image'))}>
//                         <BiImage size={25} />
//                     </button>
//                     <button onClick={() => handleFormat('insertIframe', prompt('Insert url image'))}>
//                         <BiVideo size={25} />
//                     </button>
//                 </span>
//                 <span className="te-formats">
//                     <span>Color</span>
//                     <input type="color" onInput={(e) => handleFormat('foreColor', e)} defaultValue={'#000000'} />
//                 </span>
//                 <span className="te-formats">
//                     <span>Background</span>
//                     <input type="color" onInput={(e) => handleFormat('hiliteColor', e)} defaultValue={'#000000'} />
//                 </span> */}
//             </div>
//             <div
//                 ref={editor_element}
//                 className="TextEditor-content"
//                 data-gramm="false"
//                 suppressContentEditableWarning
//                 contentEditable={true}
//                 spellCheck={false}
//             >
//                 <br />
//             </div>
//         </div>
//     );
// };

// export default TextEditor;
