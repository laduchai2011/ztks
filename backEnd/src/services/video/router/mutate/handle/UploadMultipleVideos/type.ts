export interface resolution_options {
    w: string;
    h: string;
}

export interface cmd_options {
    input_dir: string;
    input_file: string;
    output_dir: string;
    resolution: resolution_options;
}
