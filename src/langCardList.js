import React from 'react'
import langCards from './langCards';

export default function langCardList({ langcards }) {
  return (
    <div className="card-grid">
      {langcards.map(langcards => {
        return <langcards langcards={langcards} key={langcards.id} />
      })}
    </div>
  )
}

