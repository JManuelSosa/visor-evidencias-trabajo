import { AnnouncementUrl } from "./AnnouncementUrl";
import { AnnouncementFile } from "./AnnouncementFile";

export interface AnnouncementDTO {
    title:string;
    content:string;
    author:string;
    urls:AnnouncementUrl[];
    files:AnnouncementFile[];
}
