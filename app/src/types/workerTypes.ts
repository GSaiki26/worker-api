export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cardId: string;
}

export interface DefaultRes {
  data: Worker;
}

// Create
export interface CreateReq {
  firstName: string;
  lastName: string;
  email: string;
  cardId: string;
}

// GetById
export interface GetByIdReq {
  id: string;
}

// GetByCardId
export interface GetByCardIdReq {
  cardId: string;
}

// UpdateById
export interface UpdateByIdReq {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cardId?: string;
}

// DeleteById
export interface DeleteByIdReq {
  id: string;
}

export interface DeleteByIdRes {
  status: "Success";
}
