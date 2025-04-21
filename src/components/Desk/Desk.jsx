import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import "./Desk.css";
import { Tldraw, createTLStore, getSnapshot, loadSnapshot, DefaultSpinner } from 'tldraw'
import 'tldraw/tldraw.css'
import { throttle } from 'lodash'

const PERSISTENCE_KEY = 'tldraw-desk-storage'

function Desk() {
    const store = useMemo(() => createTLStore(), [])
    const [loadingState, setLoadingState] = useState({
        status: 'loading',
    })

    useLayoutEffect(() => {
        setLoadingState({ status: 'loading' })

        // Получаем данные из localStorage
        const persistedSnapshot = localStorage.getItem(PERSISTENCE_KEY)

        if (persistedSnapshot) {
            try {
                const snapshot = JSON.parse(persistedSnapshot)
                loadSnapshot(store, snapshot)
                setLoadingState({ status: 'ready' })
            } catch (error) {
                setLoadingState({ status: 'error', error: error.message })
            }
        } else {
            setLoadingState({ status: 'ready' })
        }

        // При каждом изменении хранилища выполняем (с debounce) функцию сохранения
        const cleanupFn = store.listen(
            throttle(() => {
                const snapshot = getSnapshot(store)
                localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot))
            }, 500)
        )

        return () => {
            cleanupFn()
        }
    }, [store])

    if (loadingState.status === 'loading') {
        return (
            <div className="desk-container">
                <div className="tldraw__editor">
                    <h2>
                        <DefaultSpinner />
                    </h2>
                </div>
            </div>
        )
    }

    if (loadingState.status === 'error') {
        return (
            <div className="desk-container">
                <div className="tldraw__editor">
                    <h2>Ошибка!</h2>
                    <p>{loadingState.error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="desk-container">
            <Tldraw store={store} />
        </div>
    )
}

export default Desk;
