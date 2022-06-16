export interface YTDLPOutput {
    id:                   string;
    title:                string;
    description:          string;
    uploader:             string;
    timestamp:            number;
    uploader_id:          string;
    uploader_url:         string;
    like_count:           number;
    repost_count:         number;
    comment_count:        number;
    age_limit:            number;
    tags:                 any[];
    formats:              Format[];
    subtitles:            Subtitles;
    thumbnails:           Thumbnail[];
    duration:             number;
    webpage_url:          string;
    original_url:         string;
    webpage_url_basename: string;
    webpage_url_domain:   string;
    extractor:            string;
    extractor_key:        string;
    playlist:             null;
    playlist_index:       null;
    thumbnail:            string;
    display_id:           string;
    fulltitle:            string;
    duration_string:      string;
    upload_date:          string;
    requested_subtitles:  null;
    __has_drm:            boolean;
    url:                  string;
    format_id:            string;
    tbr:                  number;
    width:                number;
    height:               number;
    protocol:             string;
    ext:                  string;
    video_ext:            string;
    audio_ext:            string;
    vbr:                  number;
    abr:                  number;
    format:               string;
    resolution:           string;
    dynamic_range:        string;
    filesize:             number;
    filesize_approx:      number;
    http_headers:         HTTPHeaders;
    epoch:                number;
    _filename:            string;
    filename:             string;
    urls:                 string;
    _type:                string;
}

export interface Format {
    format_id:       string;
    format_index?:   null;
    url:             string;
    manifest_url?:   string;
    tbr:             number;
    ext:             string;
    fps?:            null;
    protocol:        string;
    preference?:     null;
    quality?:        null;
    width:           number;
    height:          number;
    vcodec?:         string;
    acodec?:         string;
    dynamic_range:   string;
    video_ext:       string;
    audio_ext:       string;
    vbr:             number;
    abr:             number;
    format:          string;
    resolution:      string;
    filesize_approx: number;
    http_headers:    HTTPHeaders;
}

export interface HTTPHeaders {
    "User-agent":      string;
    Accept:            string;
    "Accept-encoding": string;
    "Accept-language": string;
    "Sec-fetch-mode":  string;
}

export interface Subtitles {
}

export interface Thumbnail {
    id:         string;
    url:        string;
    width:      number;
    height:     number;
    resolution: string;
}
