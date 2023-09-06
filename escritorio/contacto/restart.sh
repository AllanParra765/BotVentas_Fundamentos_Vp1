#!/bin/bash

while true
do
  node /Bot_Venta/apirest/appRest.js # Reemplaza con la ruta de tu server
  echo "Server crashed. Restarting..."
  sleep 1
done
#Comentarios
#Verifica que la ruta de tu servidor es correcta
#Ini ciarlo en el Terminal o la Ventana de la Consola: nos colocamos en la ruta conde esta el archivo y ejecutamos el siguiente comando:
#chmod +x restart.sh    #es para crear un bucle de ejecución
#./restart.sh           #es para ejecutar el archivo

#Detener el Servidor Node.js
#Cerrar el Terminal o la Ventana de la Consola:
#Si has ejecutado el script directamente en una ventana de la consola o terminal, simplemente puedes cerrar esa ventana y se detendrá el servidor.
#Usar Ctrl + C:
#Si estás ejecutando el script en una ventana de la consola o terminal, puedes presionar Ctrl + C. Esto enviará una señal de interrupción al proceso y lo detendrá.
#Encontrar y Matar el Proceso:
#Puedes encontrar y matar el proceso manualmente utilizando el comando ps (para listar procesos) y kill (para matar un proceso) en sistemas Unix/Linux o macOS. Esto requerirá conocer el ID del proceso (PID) de tu servidor Node.js. Aquí hay un ejemplo general:
