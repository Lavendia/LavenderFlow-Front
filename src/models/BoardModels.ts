export interface BoardModel {
    id: number
    name: string
    description: string | null
}

export interface ListModel {
    id: number
    name: string
    order: number
}

export interface CardModel {
    id: number
    name: string
    order: number
    description: string | null
    archived: boolean
    deadline?: string | null
    listItemId: number
}

export interface UserModel {
    id: number
    name: string
    email: string
}

export interface BoardMember {
    userId: number
    userName: string
    roleName: string | null
    boardId: number
}

export interface BoardSettingsPopupProps {
    isOpen: boolean
    board: BoardModel
    onClose: () => void
    onBoardDeleted: () => void
    onBoardUpdated: (board: BoardModel) => void
}