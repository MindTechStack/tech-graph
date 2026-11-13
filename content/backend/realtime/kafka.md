---
id: kafka
name: "Kafka"
kind: platform
status: planned
tags: [kafka, event-streaming, pub-sub, message-broker, realtime, microservices]
what: "Distributed, append-only event log that producers write to and consumer groups read from, partitioned and replicated across brokers."
why: "Decouples microservices through asynchronous event streams, persists append-only partitioned logs, and handles millions of events per second with high durability."
problem: "Direct synchronous HTTP/RPC calls between services cause tight coupling, cascading failures under load, and inability to replay past events."
relations:
  - { to: nodejs, label: "accessed from" }
  - { to: websocket, label: "streams events to" }
links:
  - { title: "Apache Kafka Documentation", url: "https://kafka.apache.org/documentation/" }
  - { title: "KafkaJS Guide", url: "https://kafka.js.org/" }
alsoIn: []
source: self-study
---

## Example
```ts
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "inventory-group" });

async function run() {
  // Produce an event partitioned by order key
  await producer.connect();
  await producer.send({
    topic: "order-events",
    messages: [
      {
        key: "order-101",
        value: JSON.stringify({ orderId: "101", status: "created", amount: 250 }),
      },
    ],
  });

  // Consume events with a consumer group
  await consumer.connect();
  await consumer.subscribe({ topic: "order-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value?.toString() ?? "{}");
      console.log(`[${topic}:${partition}] Received order:`, payload);
    },
  });
}
```

## Key points
- **Append-only partitioned log**: topics are divided into partitions; events within each partition are strictly ordered by offset and written immutably to disk.
- **Consumer groups & horizontal scaling**: multiple consumers share the partitions of a topic, allowing automatic load rebalancing and independent offset tracking.
- **Durable event replay**: events persist according to configurable retention periods (or indefinitely via log compaction), enabling new or recovering consumers to replay historical streams.
