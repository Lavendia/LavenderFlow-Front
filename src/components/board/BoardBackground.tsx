import { APIBoard } from "@/src/api_utils/APIBoardUtils"
import { APICard } from "@/src/api_utils/APICardUtils"
import { APIList } from "@/src/api_utils/APIListUtils"
import type {BoardModel, CardModel, ListModel } from "@/src/models/BoardModels"
import { useEffect, useState } from "react"
import { List } from "./ListItem"
import { PopupDialog } from "../PopupDialog"
import { connection } from "@/src/api_utils/APISignalrUtils"
import { HubConnectionState } from "@microsoft/signalr/dist/esm/HubConnection"

export function BoardBackground() {
    const [ board, setBoard ] = useState<BoardModel | null>(null)
    const [ lists, setLists ] = useState<ListModel[]>([])
    const [ cards, setCards ] = useState<CardModel[]>([])
    const [ popupOpen, setPopupOpen ] = useState(false)

    const boardId = window.location.search.split("id=")[1];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const boardResponse = await APIBoard.getBoardById(boardId)
                setBoard({
                    id: boardResponse.id,
                    name: boardResponse.name,
                    description: boardResponse.description
                })

                const listsResponse = await APIList.getListsByBoardId(boardId)
                setLists(listsResponse)

                const cardsResponses = await Promise.all(
                    listsResponse.map((list: ListModel) => APICard.getCardsByListId(list.id.toString()))
                )

                setCards(cardsResponses.flat())

            } catch (error) {
                console.error("Failed to load data:", error)
            }
        }

        const connectBoardHub = async () => {
            try {
                if (connection.state !== HubConnectionState.Connected) {
                    await connection.start();
                }
                await connection.invoke(
                    "JoinBoard",
                    Number(boardId)
                );
                console.log("Joined board",boardId );
            }
            catch(error)
            {
                console.error(error);
            }
        };

        fetchData()
        connectBoardHub()

        connection.on(
            "CardCreated",
            (card: CardModel) => {
                setCards(prev => [
                    ...prev,
                    card
                ]);
            }
        );

        connection.on(
            "CardUpdated",
            (updatedCard: CardModel) => {

                console.log(
                    "RECEIVED UPDATE",
                    updatedCard
                );

                setCards(prev =>
                    prev.map(card =>
                        card.id === updatedCard.id
                            ? updatedCard
                            : card
                    )
                );
            }
        );

        connection.on(
            "CardDeleted",
            (cardId: number) => {
                setCards(prev =>
                    prev.filter(
                        c => c.id !== cardId
                    )
                );
            }
        );

        return () => {
            connection.off(
                "CardCreated"
            );
            connection.off(
                "CardUpdated"
            );
            connection.off(
                "CardDeleted"
            );
            connection.invoke(
                "LeaveBoard",
                Number(boardId)
            );
        };
    }, [])

    const handleAddCard = async (listId: number, name: string) => {
        const tempId = -Math.floor(Math.random() * 1000000)
        const tempCard: CardModel = {
            id: tempId,
            name,
            order: cards.filter(c => c.listItemId === listId).length,
            listItemId: listId,
            archived: false,
            description: "",
        }

        setCards(prev => [...prev, tempCard])
        try {
            await APICard.createCard(
                name,
                0,
                listId,
                ""
            )
            const cardsResponses = await Promise.all(
                lists.map((list: ListModel) => APICard.getCardsByListId(list.id.toString()))
            )
            setCards(cardsResponses.flat())
        } catch {
            setCards(prev =>
                prev.filter(card => card.id !== tempId)
            )
        }
    }

    const handleAddList = async (name: string) => {
        const tempId = -Math.floor(Math.random() * 1000000)
        const tempList: ListModel = {
            id: tempId,
            name,
            order: lists.length
        }
        setLists(prev => [...prev, tempList])
        try {
            await APIList.createList(
                name,
                lists.length,
                board!.id
            )
            const listsResponse = await APIList.getListsByBoardId(board!.id.toString())
            setLists(listsResponse)
        } catch {
            setLists(prev =>
                prev.filter(list => list.id !== tempId)
            )
        }
    }

    const handleDeleteList = async (listId: number) => {
        await APIList.deleteList(listId.toString())
        setLists(prev => prev.filter(l => l.id !== listId))
    }

    const handleDeleteCard = async (cardId: number) => {
        await APICard.deleteCard(cardId.toString())
        setCards(prev => prev.filter(c => c.id !== cardId))
    }

    return (
        <section className="min-h-screen relative max-h-[10vh]">

           <div className="absolute top-25 md:top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="text-center text-white font-serif text-3xl rounded-lg border border-[#3d1a6e] hover:border-[#D896FF] transition-colors bg-transparent px-3">
                    {board?.name}
                </div>
            </div>

            <div className="
                absolute
                w-[97%] h-[90%]
                top-[58%] md:top-1/2
                left-1/2
                -translate-x-1/2
                translate-y-[-48%]
                bg-[#2d1052]
                border border-[#3d1a6e]
                rounded-lg px-3 py-2.5 shadow-lg
            ">
                <div className="flex gap-4 h-full overflow-x-auto items-start">
                    {lists.toSorted((a, b) => a.order - b.order).map(list => (
                        <List
                            key={list.id}
                            list={list}
                            cards={cards.filter(card => card.listItemId === list.id)}
                            onAddCard={handleAddCard}
                            onDeleteList={handleDeleteList}
                            onDeleteCard={handleDeleteCard}
                        />
                    ))}
                </div>

                <button
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-[#D896FF] border border-[#D896FF] rounded px-3 py-1 cursor-pointer hover:bg-[#D896FF]/20 transition-colors"
                    onClick={() => setPopupOpen(true)}
                >
                    + Add new list
                </button>
            </div>

            <PopupDialog
                isOpen={popupOpen}
                title="Add new list"
                placeholder="Enter list name..."
                onConfirm={(name) => {handleAddList(name); setPopupOpen(false)}}
                onCancel={() => setPopupOpen(false)}
            />

        </section>
    )
}