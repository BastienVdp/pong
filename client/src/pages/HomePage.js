import React, {useEffect, useState} from 'react'
import GeneratorQR from '../components/GeneratorQR'
import {useAppContext} from "../contexts/AppContext";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useNavigate} from "react-router-dom";

export default function HomePage({ socket }) {

  const navigate = useNavigate()
  const { room } = useAppContext()

  const randomId = (Math.random() + 1).toString(36).substring(7)

  const events = [
    {
      name: 'player:join',
      callback: (data) => {
        navigate(`/game/${data.room}`)
      }
    }
  ]
  useSocketEvents(events)

  // useEffect(() => console.log(room), [room])
  return <>
    <GeneratorQR value={`http://192.168.1.9:3000/connect/${randomId}`} />
  </>
}
