import tkinter as tk
import serial

# Define serial port and baud rate
arduino_port = "COM3"  # Replace with your actual port
arduino_baudrate = 9600

# Initialize serial communication
ser = serial.Serial(arduino_port, arduino_baudrate)

# Define function to send duty cycle to Arduino
def send_duty_cycle():
    try:
        duty_cycle = int(entry_field.get())
        # validate duty cycle within limits
        if duty_cycle < MIN_PWM_BOUND or duty_cycle > MAX_PWM_BOUND:
            raise ValueError("Invalid duty cycle. Please enter a value between "
                             + str(MIN_PWM_BOUND) + " and " + str(MAX_PWM_BOUND) + ".")
        # send duty cycle to Arduino
        ser.write(str(duty_cycle).encode())
        print(f"Sent duty cycle: {duty_cycle}")
    except ValueError as error:
        print(error)

# Define tkinter window
window = tk.Tk()
window.title("EDF Speed Control")

# Define entry field and button
entry_field = tk.Entry(window, width=10)
entry_field.pack()

set_button = tk.Button(window, text="Set", command=send_duty_cycle)
set_button.pack()

# Start main event loop
window.mainloop()

# Close serial communication
ser.close()
