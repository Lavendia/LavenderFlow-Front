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
    deadline?: Date | null
    listItemId: number
}