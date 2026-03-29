export enum format_enum {
    BOLD = 'BOLD',
    ITALIC = 'ITALIC',
    UNDER_LINE = 'UNDER_LINE',
    STRIKE_THROUGH = 'STRIKE_THROUGH',
    LEFT = 'LEFT', // NOT USE
    RIGHT = 'RIGHT', // NOT USE
    CENTER = 'CENTER', // NOT USE
    UNORDERED_LIST = 'UNORDERED_LIST',
    ORDERED_LIST = 'ORDERED_LIST',
}

export type format_type =
    | typeof format_enum.BOLD
    | format_enum.ITALIC
    | format_enum.UNDER_LINE
    | format_enum.STRIKE_THROUGH
    | format_enum.LEFT
    | format_enum.RIGHT
    | format_enum.CENTER
    | format_enum.UNORDERED_LIST
    | format_enum.ORDERED_LIST;

export interface Style_Options {
    isLeft?: boolean;
    isCenter?: boolean;
    isRight?: boolean;
}
export interface HandleFormat_Options {
    editor_element: HTMLDivElement | null;
    wrapperTag: string;
    style?: Style_Options;
}
