import path from 'path';
import { cmd_options } from './type';

export function handle_cmd(options: cmd_options): string[] {
    const input_dir: string = options.input_dir;
    const input_file: string = options.input_file;
    const output_dir: string = options.output_dir;
    const w: string = options.resolution.w;
    const h: string = options.resolution.h;

    // prettier-ignore
    const cmd = [
        '-i', path.join(input_dir, input_file), 
        '-vf', `scale=w=${w}:h=${h}`, 
        '-c:a', 'aac',
        '-ar', '48000', 
        '-b:a', '192k',
        '-c:v', 'h264', 
        '-profile:v', 'main', 
        '-crf', '20', 
        '-sc_threshold', '0', 
        '-g', '48', 
        '-keyint_min', '48', 
        '-b:v', '5000k', 
        '-maxrate', '5350k', 
        '-bufsize', '7500k',
        '-hls_time', '10', 
        '-hls_playlist_type', 'vod',
        '-hls_segment_filename', path.join(output_dir, `${w}_${h}_p_%03d.ts`), path.join(output_dir, `${w}_${h}_p.m3u8`),
    ];

    return cmd;
}
