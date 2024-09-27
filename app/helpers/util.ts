'use client';

export function LOG(content: string) {
  console.log(`[APP]: ${content}`);
}

export function ERROR(content: string) {
  console.error(`[ERROR]: ${content}`);
}
