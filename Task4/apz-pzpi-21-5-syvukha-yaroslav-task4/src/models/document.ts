type Document = {
  id: string;
  type: string;
  data?: string;
  createdAt: Date;
  userId: string;
  organizationId: string;
  documentType: string;
};

export default Document;
