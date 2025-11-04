import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';

const rutinas = [
  {
    nombre: 'Press plano',
    set: '4',
    repeticiones: '10',
    descanso: 'Descanso 2-3 minutos',
    imagen: require('..//assets/images/imagenInstructor1.jpg'),
  },
  // ...
];

const App = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <View>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        locale="es" // Agrega esta línea para cambiar el idioma a español
      />
      {selectedDate && rutinas.map((rutina, index) => (
        <View key={index}>
          <Text>{rutina.nombre}</Text>
          <Text>{rutina.set}</Text>
          <Text>{rutina.repeticiones}</Text>
          <Text>{rutina.descanso}</Text>
          <Image source={rutina.imagen} />
        </View>
      ))}
    </View>
  );
};

export default App;
