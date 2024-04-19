#!/bin/bash

# Obtient le nom du système d'exploitation
OS=$(uname)

# Si le système d'exploitation est Linux
if [ "$OS" == "Linux" ]; then
    # Obtient le chemin absolu du répertoire du script
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

    # Ouvre un nouveau terminal et exécute la première commande
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/back-end' && nodemon serveur"

    # Attend un court moment avant d'exécuter la prochaine commande
    sleep 2

    # Ouvre un nouveau terminal et exécute la deuxième commande
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/api' && npm start"

    # Attend un court moment avant d'exécuter la prochaine commande
    sleep 2

    # Ouvre un nouveau terminal et exécute la troisième commande
    gnome-terminal -- bash -c "cd '$SCRIPT_DIR/la-maison-tracteur' && npm start"

# Si le système d'exploitation est macOS
elif [ "$OS" == "Darwin" ]; then
    # Obtient le chemin absolu du répertoire du script
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

    # Ouvre un nouveau terminal et exécute la première commande
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR/back-end' && nodemon serveur\""

    # Attend un court moment avant d'exécuter la prochaine commande
    sleep 2

    # Ouvre un nouveau terminal et exécute la deuxième commande
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR/api' && npm start\""

    # Attend un court moment avant d'exécuter la prochaine commande
    sleep 2

    # Ouvre un nouveau terminal et exécute la troisième commande
    osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR/la-maison-tracteur' && npm start\""

# Si le système d'exploitation est Windows
elif [ "$OS" == "CYGWIN" ] || [ "$OS" == "MINGW32" ] || [ "$OS" == "MINGW64" ]; then
    # Obtient le chemin absolu du répertoire du script
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

    # Ouvre un nouveau terminal et exécute la première commande
    start cmd /k "cd %SCRIPT_DIR%\back-end && nodemon serveur"

    # Attend un court moment avant d'exécuter la prochaine commande
    timeout /t 2 >nul

    # Ouvre un nouveau terminal et exécute la deuxième commande
    start cmd /k "cd %SCRIPT_DIR%\api && npm start"

    # Attend un court moment avant d'exécuter la prochaine commande
    timeout /t 2 >nul

    # Ouvre un nouveau terminal et exécute la troisième commande
    start cmd /k "cd %SCRIPT_DIR%\la-maison-tracteur && npm start"

else
    echo "Système d'exploitation non pris en charge."
fi
