// Db
export interface DbWorker {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  card_id: string;
  created_at: Date;
  updated_at: Date;
}

// Proto Workers
export interface ProtoWorker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cardId: string;
}

export interface ProtoDefaultRes {
  data: ProtoWorker;
}

// Create
export interface ProtoCreateReq {
  firstName: string;
  lastName: string;
  email: string;
  cardId: string;
}

// GetById
export interface ProtoGetByIdReq {
  id: string;
}

// GetByCardId
export interface ProtoGetByCardIdReq {
  cardId: string;
}

// UpdateById
export interface ProtoUpdateByIdReq {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cardId?: string;
}

// DeleteById
export interface ProtoDeleteByIdReq {
  id: string;
}

export interface ProtoDeleteByIdRes {
  status: "Success";
}
