import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,  } from 'react-native';

const MotivationalMessages = () => {
  const [mensaje, setMensaje] = useState('');

  // Lista de mensajes motivacionales
  const mensajesMotivacionales = [
    "¡Sigue adelante! Cada esfuerzo cuenta.",
    "No te rindas, el progreso lleva tiempo.",
    "La constancia es la clave del éxito.",
    "Tu cuerpo puede más de lo que piensas.",
    "Cree en ti y todo será posible.",
    "El dolor es temporal, la satisfacción es para siempre.",
    "Transforma tus metas en acción.",
    "Cada día es una nueva oportunidad para mejorar.",
    "El esfuerzo de hoy es el éxito de mañana.",
    "Entrena duro, vive feliz.",
    "Tu límite es solo una ilusión.",
    "Cada gota de sudor es un paso más cerca de tu meta.",
    "La fuerza no viene de lo que puedes hacer, viene de superar lo que una vez pensaste que no podías.",
    "El éxito no es para los que desean, es para los que trabajan por ello.",
    "Transforma el dolor en poder.",
    "La disciplina es el puente entre metas y logros.",
    "No te compares con los demás. Compite contra ti mismo.",
    "Hazlo por las personas que dijeron que no podrías.",
    "El único mal entrenamiento es el que no se hace.",
    "La motivación te lleva a empezar, el hábito te mantiene en movimiento.",
    "La fuerza no viene de la capacidad corporal, sino de la voluntad del alma.",
    "No te detengas cuando estés cansado, detente cuando hayas terminado.",
    "Haz que tus sueños sean más grandes que tus excusas.",
    "El dolor de hoy será la fuerza de mañana.",
    "Los campeones no nacen en el gimnasio, se hacen en el esfuerzo diario.",
    "Cree en ti y en todo lo que eres capaz de lograr.",
    "No es sobre tener tiempo, es sobre hacer tiempo.",
    "La diferencia entre querer y lograr es la disciplina.",
    "Cada repetición cuenta. Cada segundo importa.",
    "El único lugar donde el éxito viene antes que el trabajo es en el diccionario.",
    "Eres más fuerte de lo que piensas.",
    "Levántate con determinación, acuéstate con satisfacción.",
    "Hoy es un buen día para empezar algo nuevo.",
    "No sueñes con ello, trabaja por ello.",
    "El esfuerzo de hoy es el orgullo de mañana.",
    "Transforma tu cuerpo, transforma tu vida.",
    "Cada desafío es una oportunidad para crecer.",
    "La perseverancia es el secreto del éxito.",
    "El fracaso es solo una oportunidad para empezar de nuevo con más experiencia.",
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "Tu cuerpo puede soportar casi cualquier cosa. Es tu mente la que necesitas convencer.",
    "Hazlo con pasión o no lo hagas.",
    "El dolor que sientes hoy será la fuerza que sentirás mañana.",
    "La mejor forma de predecir el futuro es crearlo.",
    "La energía y la persistencia conquistan todas las cosas.",
    "Nunca es demasiado tarde para ser lo que podrías haber sido.",
    "Cada paso que das te acerca un poco más a tu meta.",
    "Los hábitos se forman con consistencia.",
    "La clave del éxito es empezar antes de estar listo.",
    "No esperes a la oportunidad perfecta, créala."
  ];
  

  // Función para seleccionar un mensaje aleatorio
  const seleccionarMensajeAleatorio = () => {
    const indiceAleatorio = Math.floor(Math.random() * mensajesMotivacionales.length);
    return mensajesMotivacionales[indiceAleatorio];
  };

  useEffect(() => {
    setMensaje(seleccionarMensajeAleatorio());
  }, []);

  return (
    <Text style={styles.overlayTextBanner}>{mensaje}</Text>
  );
};

const styles = StyleSheet.create({
  overlayTextBanner: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
    color: '#fff',
  },
});

export default MotivationalMessages;
