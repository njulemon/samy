import React, {useCallback, useEffect, useMemo, useState} from 'react'
import isHotkey from 'is-hotkey'
import imageExtensions from 'image-extensions'
import {Editable, withReact, useSlate, Slate, ReactEditor, useSelected, useFocused, useSlateStatic} from 'slate-react'
import {
    Editor,
    Transforms,
    createEditor,
    Element as SlateElement
} from 'slate'
import {withHistory} from 'slate-history'

import {Button, Toolbar} from '@mui/material'
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import TableViewIcon from '@mui/icons-material/TableView';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import {css} from '@emotion/css'
import isUrl from 'is-url'
import useSlateState from "../hooks/useSlateState";


const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const withImages = editor => {
    const {insertData, isVoid} = editor

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const {files} = data


        // copy paste (convert to base64)
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result
                        // url is the base 64 content of the image.
                        insertImage(editor, url)
                    })

                    reader.readAsDataURL(file)
                }
            }
            // insert url
        } else if (isImageUrl(text)) {
            insertImage(editor, text)
        } else {
            console.log('last solution')
            insertData(data)
        }
    }

    return editor
}

const insertImage = (editor, url) => {
    const text = {text: ''}
    const image = {type: 'image', url, children: [text]}
    Transforms.insertNodes(editor, image)
}


const Image = ({attributes, children, element}) => {
    const editor = useSlateStatic()
    const path = ReactEditor.findPath(editor, element)

    const selected = useSelected()
    const focused = useFocused()
    return (
        <div {...attributes}>
            {children}
            <div
                contentEditable={false}
                className={css`
          position: relative;
        `}
            >
                <img
                    src={element.url}
                    className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
                />
                <Button
                    active="true"
                    onMouseDown={() => {
                        Transforms.removeNodes(editor, {at: path})
                    }}
                    className={css`
            display: ${selected && focused ? 'inline' : 'none'};
            position: absolute;
            top: 0.5em;
            left: 0.5em;
            background-color: white;
          `}
                >
                    <DeleteIcon/>
                </Button>
            </div>
        </div>
    )
}

const InsertImageButton = () => {
    const editor = useSlate()
    return (
        <Button
            onMouseDown={event => {
                event.preventDefault()
                const url = window.prompt('Vous pouvez indiquer l\'URL de l\'image: ' +
                    '(ou copier coller le fichier directement dans l\'éditeur)')
                if (!!url && !isImageUrl(url)) {
                    alert('URL is not an image')
                    return
                }
                insertImage(editor, url)
            }}
        >
            <InsertPhotoIcon/>
        </Button>
    )
}

const isImageUrl = url => {
    if (!url) return false
    if (!isUrl(url)) return false
    const ext = new URL(url).pathname.split('.').pop()
    return imageExtensions.includes(ext)
}

const SlateEditor = ({id, slateState}) => {
    const editor = useMemo(() => withImages(withHistory(withReact(createEditor()))), [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const renderElement = useCallback(props => <Element {...props}/>, [])



    useEffect(() => {
        editor.children = slateState.content
    }, [slateState.content])

    useEffect(() => {
        if (slateState.isSaving) {
            ReactEditor.blur(editor)
        }
        else {
            ReactEditor.blur(editor)
        }
    }, [slateState.isSaving])

    return (
        <Slate editor={editor}
               value={initialValue}
               onChange={value => onChange(value, editor, slateState.setContent)}
        >
            <Toolbar>
                <MarkButton format="bold" icon={(<FormatBoldIcon/>)} slateState={slateState}/>
                <MarkButton format="italic" icon={(<FormatItalicIcon/>)} slateState={slateState}/>
                <MarkButton format="underline" icon={(<FormatUnderlinedIcon/>)} slateState={slateState}/>
                {/*<MarkButton format="code" icon={(<FormatBoldIcon/>)}/>*/}
                <BlockButton format="heading-one" icon={(<LooksOneIcon/>)}/>
                <BlockButton format="heading-two" icon={(<LooksTwoIcon/>)}/>
                {/*<BlockButton format="block-quote" icon={(<FormatQuoteIcon/>)}/>*/}
                <BlockButton format="numbered-list" icon={(<FormatListNumberedIcon/>)}/>
                <BlockButton format="bulleted-list" icon={(<FormatListBulletedIcon/>)}/>
                <BlockButton format="left" icon={(<FormatAlignLeftIcon/>)}/>
                <BlockButton format="center" icon={(<FormatAlignCenterIcon/>)}/>
                <BlockButton format="right" icon={(<FormatAlignRightIcon/>)}/>
                <BlockButton format="justify" icon={(<FormatAlignJustifyIcon/>)}/>
                <InsertImageButton/>
                <SaveButton slateState={slateState}/>
            </Toolbar>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Commencer votre rapport... "
                spellCheck
                autoFocus
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />
        </Slate>
    )
}

const onChange = (value, editor, setContent) => {
    const isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
    )

    if (isAstChange) {
        setContent(value)
    }
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes(n.type) &&
            !TEXT_ALIGN_TYPES.includes(format),
        split: true,
    })
    let newProperties
    if (TEXT_ALIGN_TYPES.includes(format)) {
        newProperties = {
            align: isActive ? undefined : format,
        }
    } else {
        newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
    }
    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
        const block = {type: format, children: []}
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format, blockType = 'type') => {
    const {selection} = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    )

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const Element = ({attributes, children, element}) => {
    const style = {textAlign: element.align}
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'heading-two':
            return (
                <h3 style={style} {...attributes}>
                    {children}
                </h3>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        case 'image':
            return (<Image attributes={attributes} children={children} element={element}/>) // editor={rest.editor}
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}

const Leaf = ({attributes, children, leaf}) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

const BlockButton = ({format, icon}) => {
    const editor = useSlate()
    return (
        <Button
            color={isBlockActive(
                editor,
                format,
                TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
            ) ? "success" : "primary"}
            onMouseDown={event => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

const MarkButton = ({format, icon, slateState}) => {
    const editor = useSlate()
    return (
        <Button
            disabled={!!slateState.isSaving}
            color={(isMarkActive(editor, format)) ? "success" : "primary"}
            onMouseDown={event => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

const SaveButton = ({slateState}) => {
    return (
        <Button
            color={slateState?.hasChanged ? "warning" : "primary"}
            onMouseDown={event => {
                event.preventDefault()
                slateState.save()
            }}
        >
            <SaveIcon/>
        </Button>
    )
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            {text: ''}
        ],
    }
]
//     {
//         type: 'paragraph',
//         children: [
//             {
//                 text:
//                     "Since it's rich text, you can do things like turn a selection of text ",
//             },
//             {text: 'bold', bold: true},
//             {
//                 text:
//                     ', or add a semantically rendered block quote in the middle of the page, like this:',
//             },
//         ],
//     },
//     {
//         type: 'block-quote',
//         children: [{text: 'A wise quote.'}],
//     },
//     {
//         type: 'paragraph',
//         align: 'center',
//         children: [{text: 'Try it out for yourself!'}],
//     },
// ]

export default SlateEditor