# ✅ Base image with Node + Debian
FROM node:18-bullseye

# ✅ Install Python, pip, ffmpeg & build tools (needed for sqlite3)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg build-essential

# ✅ Set working directory
WORKDIR /app

# ✅ Copy only package.json to leverage Docker layer caching
COPY package*.json ./

# ✅ Install Node.js dependencies INSIDE Docker (Linux compatible)
RUN npm install --build-from-source

# ✅ Copy Python requirements and install
COPY server/python/requirements.txt ./python-requirements.txt
RUN pip3 install -r python-requirements.txt

# ✅ Copy the rest of the application
COPY . .

# ✅ Expose API port
EXPOSE 5000

# ✅ Start Node.js server
CMD ["node", "server/index.js"]
