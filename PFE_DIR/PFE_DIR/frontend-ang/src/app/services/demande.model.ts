export class Demande {
  id: number;
  description: string;
  status: string;
  file_imageBefore:string;
  title:string;
  createdAt:Date;
  priority:string;
  dateResubmission:Date;
  file_imageAfter:string;
  remarque : string;


  constructor(id: number, description: string, status: string,file_imageBefore : string,
              title:string,createAt:Date,priority:string,dateResubmission:Date,
              file_imageAfter:string,remarque:string) {
    this.id = id;
    this.description = description;
    this.status = status;
    this.file_imageBefore=file_imageBefore;
    this.title=title;
    this.createdAt=createAt;
    this.priority=priority;
    this.dateResubmission=dateResubmission;
    this.file_imageAfter=file_imageAfter;
    this.remarque=remarque;
  }

}
