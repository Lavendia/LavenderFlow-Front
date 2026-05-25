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
    description: string | undefined
    archived: boolean
    deadline?: Date | undefined
    listItemId: number
}