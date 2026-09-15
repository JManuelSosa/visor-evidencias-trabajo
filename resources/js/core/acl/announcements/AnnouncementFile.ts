export interface AnnouncementFile {
    url:string;
    mime_type:string;
    file_type:FileType;
    title:string;
    sort_order:number;
}

export type FileType = "image" | "video" | "pdf" | "document" | "spreadsheet" | "presentation";
