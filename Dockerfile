# ---------- Stage 1: build ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Install deps (better cache)
    COPY package*.json ./
    RUN npm ci
    
    # Copy source & build
    COPY . .
    RUN npm run build
    
    
    # ---------- Stage 2: production runtime ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Copy only what we need for production
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Bring built dist from builder
    COPY --from=builder /app/dist ./dist
    
    # If you need these at runtime, uncomment:
    # COPY --from=builder /app/node_modules ./node_modules  # (not needed if npm ci --omit=dev ran)
    # COPY --from=builder /app/prisma ./prisma              # (if using Prisma and runtime needs schema/migrations)
    # COPY --from=builder /app/public ./public              # (if you serve static files)
    # COPY --from=builder /app/views ./views                # (if you use templates)
    
    # Your app port (change if needed)
    EXPOSE 3001
    
    # Start NestJS
    CMD ["node", "dist/main.js"]
    