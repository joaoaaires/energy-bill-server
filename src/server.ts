import Fastify from 'fastify'
import cors from '@fastify/cors'
import autoload from '@fastify/autoload'
import multipart from '@fastify/multipart'
import path from 'path'
import { existsSync, mkdirSync } from 'node:fs'

try {
  const folderName = 'uploads'
  if (!existsSync(folderName)) {
    mkdirSync(folderName)
  }
} catch (err) {
  console.error(err)
}

const app = Fastify({
  logger: true,
})

app.register(multipart)
app.register(cors, {
  origin: true,
})
app.register(autoload, {
  dir: path.join(__dirname, 'app/features'),
  ignorePattern: /^.*index\.ts.*$/,
  maxDepth: 1,
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
