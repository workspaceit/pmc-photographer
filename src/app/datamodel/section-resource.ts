export class SectionResource{
  id: number;
  sectionId: number;
  fileName: string;
  url:string;
  fileType: string;
  mimeType: string;
  createdAt: string;
  selectedStatic:boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
