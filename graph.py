import random
from itertools import count
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

x_vals = []
y_vals = []

index = count()


def animate(i):
    data = pd.read_csv('C://Users//HP//Desktop//dtwin_native//dt1.csv')
    cols = ["timestamp", "Temp_R", "timestamp", "Current","timestamp", "Vib_Extuder","timestamp" ,"Vibration2"  ]
    data.columns = cols
    x = data["timestamp"]
    y1 = data["Temp_R"]
    plt.cla()
    plt.plot(x, y1, label='V1')
    plt.tight_layout()


ani = FuncAnimation(plt.gcf(), animate, interval=1000)

plt.tight_layout()
plt.show()