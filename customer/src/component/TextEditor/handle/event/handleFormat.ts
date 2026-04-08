import { HandleFormat_Options } from '../../type';

class HandleFormat {
    private _options: HandleFormat_Options;

    constructor(options: HandleFormat_Options) {
        this._options = options;
    }

    get_wrapperTag = (): string => {
        return this._options.wrapperTag;
    };

    set_wrapperTag = (wrapperTag: string) => {
        this._options.wrapperTag = wrapperTag;
    };

    remove_wrapperTag = () => {
        const wrapperTag = this._options.wrapperTag;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        // const range = selection.getRangeAt(0);
        // const selectedText = range.toString();
        // console.log(selectedText);

        const anchorNode = selection.anchorNode;
        if (!anchorNode) return;

        const wrapper_Element = anchorNode.parentElement;
        if (!wrapper_Element) return;

        // console.log(111111111, wrapper_Element.childNodes);

        for (let i: number = 0; i < wrapper_Element.childNodes.length; i++) {
            const childNode = wrapper_Element.childNodes[i];
            const wrapperNode_Element = childNode.parentElement;

            if (!wrapperNode_Element) return;

            if (wrapperNode_Element.tagName.toLowerCase() === wrapperTag) {
                const fragment = document.createDocumentFragment();
                while (wrapperNode_Element.firstChild) {
                    fragment.appendChild(wrapperNode_Element.firstChild);
                }
                wrapperNode_Element.replaceWith(fragment);
            }
        }
    };

    // traverse_remove_wrapper_in = (wrapper_Element: HTMLElement | null, index: number) => {
    //     // console.log(wrapper_Element);
    //     const wrapperTag = this._options.wrapperTag;
    //     if (!wrapper_Element) return;
    //     const len = wrapper_Element.childNodes.length;

    //     const childNode = wrapper_Element.childNodes[index];
    //     if (!childNode) return;

    //     if (childNode.nodeType !== Node.TEXT_NODE) {
    //         const parentElement_of_childNode = childNode.parentElement;
    //         if (!parentElement_of_childNode) return;
    //         if (parentElement_of_childNode.tagName.toLowerCase() === wrapperTag) {
    //             const fragment = document.createDocumentFragment();
    //             while (parentElement_of_childNode.firstChild) {
    //                 fragment.appendChild(parentElement_of_childNode.firstChild);
    //             }
    //             parentElement_of_childNode.replaceWith(fragment);

    //             this._isWrapper = true;

    //             if (index < len) {
    //                 this.traverse_remove_wrapper_in(wrapper_Element, index + 1);
    //             }
    //         } else {
    //             const wrapper_child_Element = childNode.parentElement;
    //             if (!wrapper_child_Element) return;
    //             this.traverse_remove_wrapper_in(wrapper_child_Element, 0);
    //         }
    //     } else {
    //         if (index < len) {
    //             this.traverse_remove_wrapper_in(wrapper_Element, index + 1);
    //         }
    //     }
    // };

    // traverse_remove_wrapper_out = () => {
    //     // not do yet
    // };

    // toggle1 = () => {
    //     const editor_element = this._options.editor_element;
    //     if (!editor_element) return;

    //     const wrapperTag = this._options.wrapperTag;

    //     const selection = window.getSelection();
    //     if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    //     const range = selection.getRangeAt(0);
    //     const selectedText = range.toString();

    //     const anchorNode = selection.anchorNode;
    //     if (!anchorNode) return;

    //     const wrapperElement = anchorNode.parentElement;
    //     if (!wrapperElement) return;

    //     console.log(wrapperElement, this._isWrapper);

    //     this.traverse_remove_wrapper_in(wrapperElement, 0);

    //     if (this._isWrapper === false) {
    //         const wrapper = document.createElement(wrapperTag);
    //         wrapper.textContent = selectedText;

    //         range.deleteContents();
    //         range.insertNode(wrapper);

    //         // Reset selection to the new node
    //         selection.removeAllRanges();
    //         const newRange = document.createRange();
    //         if (wrapper.firstChild) {
    //             newRange.setStart(wrapper.firstChild, 0);
    //             newRange.setEnd(wrapper.firstChild, wrapper.firstChild.textContent?.length || 0);
    //             selection.addRange(newRange);
    //         }

    //         this._isWrapper = true;
    //     }

    //     const nodes = wrapperElement.childNodes;
    //     for (let i = nodes.length - 1; i >= 0; i--) {
    //         const node = nodes[i];
    //         if (node.nodeType === Node.TEXT_NODE && !node.nodeValue?.trim()) {
    //             wrapperElement.removeChild(node);
    //         }
    //     }
    // };

    toggle = () => {
        const editor_element = this._options.editor_element;
        if (!editor_element) return;

        const wrapperTag = this._options.wrapperTag;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        const anchorNode = selection.anchorNode;
        if (!anchorNode) return;

        const wrapperElement = anchorNode.parentElement;
        if (!wrapperElement) return;

        if (wrapperElement.tagName.toLowerCase() === wrapperTag) {
            const fragment = document.createDocumentFragment();
            while (wrapperElement.firstChild) {
                fragment.appendChild(wrapperElement.firstChild);
            }
            wrapperElement.replaceWith(fragment);

            const childrens = Array.from(editor_element.childNodes);
            const index = childrens.indexOf(anchorNode as Element);

            selection.removeAllRanges();
            const newRange = document.createRange();

            if (editor_element.childNodes[index]) {
                newRange.setStart(editor_element.childNodes[index], 0);
                newRange.setEnd(
                    editor_element.childNodes[index],
                    editor_element.childNodes[index].textContent?.length || 0
                );

                selection.addRange(newRange);
            }
        } else {
            const wrapper = document.createElement(wrapperTag);
            wrapper.textContent = selectedText;

            // if (this._options.style?.isLeft) {
            //     wrapper.style.width = '100%';
            //     wrapper.style.textAlign = 'left';
            // }

            // if (this._options.style?.isRight) {
            //     wrapper.style.width = '100%';
            //     wrapper.style.textAlign = 'right';
            // }

            // if (this._options.style?.isCenter) {
            //     wrapper.style.width = '100%';
            //     wrapper.style.textAlign = 'center';
            // }

            range.deleteContents();
            range.insertNode(wrapper);

            // Reset selection to the new node
            selection.removeAllRanges();
            const newRange = document.createRange();
            if (wrapper.firstChild) {
                newRange.setStart(wrapper.firstChild, 0);
                newRange.setEnd(wrapper.firstChild, wrapper.firstChild.textContent?.length || 0);
                selection.addRange(newRange);
            }
        }

        const nodes = editor_element.childNodes;
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            if (node.nodeType === Node.TEXT_NODE && !node.nodeValue?.trim()) {
                editor_element.removeChild(node);
            }
        }
    };
}

export { HandleFormat };
