import { db, pool } from "./db.js";
import { users, categories, tags, posts, postsTags, projects } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  // User
  const [user] = await db.insert(users).values({
    username: "admin",
    password: "password123",
  }).returning();
  console.log(`Created user: admin (id=${user.id})`);

  // Categories
  const catData = [
    { name: "Data Engineering", slug: "data-engineering", description: "Data pipelines, ETL processes, and data architecture best practices.", icon: "database", color: "blue" },
    { name: "Machine Learning", slug: "machine-learning", description: "ML algorithms, model training, and practical applications of AI.", icon: "brain", color: "purple" },
    { name: "Data Visualization", slug: "data-visualization", description: "Creating effective dashboards and visualization techniques.", icon: "chart-line", color: "green" },
    { name: "Cloud Solutions", slug: "cloud-solutions", description: "Cloud-based data platforms, serverless architectures, and more.", icon: "cloud", color: "red" },
  ];

  const catIds: Record<string, number> = {};
  for (const c of catData) {
    const [cat] = await db.insert(categories).values(c).returning();
    catIds[c.slug] = cat.id;
    console.log(`Created category: ${c.name} (id=${cat.id})`);
  }

  // Tags
  const tagData = [
    { name: "ETL", slug: "etl" },
    { name: "PyTorch", slug: "pytorch" },
    { name: "Tableau", slug: "tableau" },
    { name: "BigData", slug: "big-data" },
    { name: "Deep Learning", slug: "deep-learning" },
    { name: "D3.js", slug: "d3js" },
    { name: "AWS", slug: "aws" },
    { name: "NLP", slug: "nlp" },
  ];

  const tagIds: Record<string, number> = {};
  for (const t of tagData) {
    const [tag] = await db.insert(tags).values(t).returning();
    tagIds[t.slug] = tag.id;
    console.log(`Created tag: ${t.name} (id=${tag.id})`);
  }

  // Posts
  const post1 = await db.insert(posts).values({
    title: "Building Resilient Data Pipelines with Apache Airflow",
    slug: "building-resilient-data-pipelines-apache-airflow",
    excerpt: "Learn how to design and implement fault-tolerant data pipelines that can handle upstream system failures gracefully.",
    content: `# Building Resilient Data Pipelines with Apache Airflow

Data pipelines are the backbone of any data-driven organization. In real-world scenarios, these pipelines face numerous challenges — upstream systems fail, APIs go down, or network issues cause interruptions.

## Key Strategies

### 1. Implementing Proper Retry Mechanisms

\`\`\`python
task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_function,
    retries=3,
    retry_delay=timedelta(minutes=5)
)
\`\`\`

### 2. Circuit Breakers

Circuit breakers prevent cascading failures by failing fast when a system is known to be down.

### 3. Dead Letter Queues

When data processing fails after multiple retries, move problematic records to a dead letter queue for later analysis.

### 4. Idempotent Operations

Ensure tasks can be safely re-executed without causing duplicate data or side effects.

## Conclusion

Building resilient data pipelines is about designing systems that anticipate problems and recover gracefully. The goal is not to prevent all failures — that's impossible in distributed systems — but to ensure your pipeline recovers without manual intervention.`,
    coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    publishedAt: new Date("2026-03-12"),
    featured: true,
    readingTime: 8,
    categoryId: catIds["data-engineering"],
    authorId: user.id,
    status: "published",
  }).returning();
  console.log(`Created post: ${post1[0].title}`);

  const post2 = await db.insert(posts).values({
    title: "Neural Network Architectures for Time Series Forecasting",
    slug: "neural-network-architectures-time-series-forecasting",
    excerpt: "Comparing the effectiveness of LSTM, GRU, and Transformer models for predicting complex time-dependent patterns.",
    content: `# Neural Network Architectures for Time Series Forecasting

Time series forecasting is critical in many domains, from financial market prediction to demand forecasting in supply chains.

## Key Architectures

### LSTM (Long Short-Term Memory)

LSTMs have been the traditional workhorse for sequence modeling, with their ability to maintain memory over long sequences.

**Advantages:** Handles long-term dependencies, mitigates vanishing gradient
**Limitations:** Computationally expensive, sequential processing limits parallelization

### GRU (Gated Recurrent Unit)

GRUs simplify the LSTM architecture while maintaining performance.

**Advantages:** Faster training than LSTM, fewer parameters
**Limitations:** Less expressive in some complex tasks

### Transformer-based Models

Transformers have revolutionized NLP and are now making waves in time series.

**Advantages:** Parallel processing, self-attention captures all dependencies
**Limitations:** Quadratic complexity, requires more data

## Empirical Comparison

| Model | MAE | RMSE | Training Time |
|-------|-----|------|--------------|
| LSTM  | 15.2| 19.8 | 45 min       |
| GRU   | 15.8| 20.1 | 32 min       |
| Transformer | 13.6| 17.5 | 68 min  |

The Transformer showed ~10% improvement in accuracy but required more training time.`,
    coverImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
    publishedAt: new Date("2026-02-28"),
    featured: true,
    readingTime: 10,
    categoryId: catIds["machine-learning"],
    authorId: user.id,
    status: "published",
  }).returning();
  console.log(`Created post: ${post2[0].title}`);

  const post3 = await db.insert(posts).values({
    title: "Building Interactive Executive Dashboards That Drive Decisions",
    slug: "building-interactive-executive-dashboards-drive-decisions",
    excerpt: "How to design data visualizations that help stakeholders quickly understand complex metrics and make informed business decisions.",
    content: `# Building Interactive Executive Dashboards That Drive Decisions

In today's data-driven business environment, executives are inundated with information but often struggle to extract actionable insights.

## Key Dashboard Design Principles

### 1. Clarity Over Complexity
- Limit to 5-7 key metrics on a single view
- Present information in a logical hierarchy
- Use consistent visual language

### 2. Progressive Disclosure
Layer information to allow executives to explore details as needed through drill-down functionality.

### 3. Contextual Information
- Include historical trends
- Show targets or benchmarks
- Indicate performance thresholds with clear visual cues

### 4. Actionable Insights
Design dashboards that answer "So what?" and suggest "What next?"

## Choosing the Right Visualization Types

| Type | Best For |
|------|----------|
| KPI Cards | Headline numbers, simple comparisons |
| Line Charts | Trends over time |
| Bar Charts | Comparisons across categories |
| Heatmaps | Patterns across multiple variables |
| Scatter Plots | Relationship analysis |

## Conclusion

Effective executive dashboards translate complex data into clear insights that drive strategic decisions. Start with a minimal viable dashboard, gather feedback, and continuously refine.`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    publishedAt: new Date("2026-02-15"),
    featured: true,
    readingTime: 8,
    categoryId: catIds["data-visualization"],
    authorId: user.id,
    status: "published",
  }).returning();
  console.log(`Created post: ${post3[0].title}`);

  // Post-tag associations
  await db.insert(postsTags).values({ postId: post1[0].id, tagId: tagIds["etl"] });
  await db.insert(postsTags).values({ postId: post2[0].id, tagId: tagIds["pytorch"] });
  await db.insert(postsTags).values({ postId: post3[0].id, tagId: tagIds["tableau"] });

  // Projects
  const proj1 = await db.insert(projects).values({
    title: "Real-time Analytics Platform",
    slug: "real-time-analytics-platform",
    description: "Built a scalable, real-time data processing platform using Kafka, Spark Streaming, and AWS services to analyze user behavior for a SaaS product.",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    technologies: ["Apache Kafka", "Spark", "S3"],
    categoryId: catIds["data-engineering"],
    featured: true,
    url: "https://github.com/example/real-time-analytics",
  }).returning();
  console.log(`Created project: ${proj1[0].title}`);

  const proj2 = await db.insert(projects).values({
    title: "Sentiment Analysis API",
    slug: "sentiment-analysis-api",
    description: "Developed a multilingual sentiment analysis API that helps businesses analyze customer feedback across different languages with high accuracy.",
    coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
    technologies: ["PyTorch", "FastAPI", "Docker"],
    categoryId: catIds["machine-learning"],
    featured: true,
    url: "https://github.com/example/sentiment-analysis",
  }).returning();
  console.log(`Created project: ${proj2[0].title}`);

  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
