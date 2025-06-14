import {
  users, type User, type InsertUser,
  posts, type Post, type InsertPost,
  categories, type Category, type InsertCategory,
  tags, type Tag, type InsertTag,
  postsTags, type PostTag, type InsertPostTag,
  projects, type Project, type InsertProject,
  contactMessages, type ContactMessage, type InsertContactMessage,
  subscriptions, type Subscription, type InsertSubscription
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Post operations
  getAllPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  getFeaturedPosts(): Promise<Post[]>;
  getLatestPosts(limit?: number): Promise<Post[]>;
  getPostsByCategory(categoryId: number): Promise<Post[]>;
  getPostsByTag(tagId: number): Promise<Post[]>;
  searchPosts(query: string): Promise<Post[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Tag operations
  getAllTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagBySlug(slug: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;

  // Post-Tag operations
  createPostTag(postTag: InsertPostTag): Promise<PostTag>;
  getTagsByPostId(postId: number): Promise<Tag[]>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  getFeaturedProjects(): Promise<Project[]>;

  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Newsletter subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionByEmail(email: string): Promise<Subscription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private categories: Map<number, Category>;
  private tags: Map<number, Tag>;
  private postsTags: Map<number, PostTag>;
  private projects: Map<number, Project>;
  private contactMessages: Map<number, ContactMessage>;
  private subscriptions: Map<number, Subscription>;

  private currentUserIds: number;
  private currentPostIds: number;
  private currentCategoryIds: number;
  private currentTagIds: number;
  private currentPostTagIds: number;
  private currentProjectIds: number;
  private currentContactMessageIds: number;
  private currentSubscriptionIds: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.postsTags = new Map();
    this.projects = new Map();
    this.contactMessages = new Map();
    this.subscriptions = new Map();

    this.currentUserIds = 1;
    this.currentPostIds = 1;
    this.currentCategoryIds = 1;
    this.currentTagIds = 1;
    this.currentPostTagIds = 1;
    this.currentProjectIds = 1;
    this.currentContactMessageIds = 1;
    this.currentSubscriptionIds = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserIds++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return Array.from(this.posts.values()).find(
      (post) => post.slug === slug,
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostIds++;
    // Ensure featured is not undefined
    const featured = insertPost.featured ?? false;
    const post: Post = { ...insertPost, id, featured };
    this.posts.set(id, post);
    return post;
  }

  async getFeaturedPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getLatestPosts(limit: number = 10): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getPostsByTag(tagId: number): Promise<Post[]> {
    const postIds = Array.from(this.postsTags.values())
      .filter(pt => pt.tagId === tagId)
      .map(pt => pt.postId);
    
    return Array.from(this.posts.values())
      .filter(post => postIds.includes(post.id))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.posts.values())
      .filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.excerpt.toLowerCase().includes(lowerQuery) || 
        post.content.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryIds++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async getTagBySlug(slug: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      (tag) => tag.slug === slug,
    );
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagIds++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  // Post-Tag methods
  async createPostTag(insertPostTag: InsertPostTag): Promise<PostTag> {
    const id = this.currentPostTagIds++;
    const postTag: PostTag = { ...insertPostTag, id };
    this.postsTags.set(id, postTag);
    return postTag;
  }

  async getTagsByPostId(postId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.postsTags.values())
      .filter(pt => pt.postId === postId)
      .map(pt => pt.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => tagIds.includes(tag.id));
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(
      (project) => project.slug === slug,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectIds++;
    // Ensure featured is not undefined and url is not undefined
    const featured = insertProject.featured ?? false;
    const url = insertProject.url ?? null;
    const project: Project = { ...insertProject, id, featured, url };
    this.projects.set(id, project);
    return project;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.featured);
  }

  // Contact message methods
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageIds++;
    const message: ContactMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, message);
    return message;
  }

  // Newsletter subscription methods
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentSubscriptionIds++;
    const subscription: Subscription = { 
      ...insertSubscription, 
      id, 
      createdAt: new Date() 
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getSubscriptionByEmail(email: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.email === email,
    );
  }

  // Sample data initialization
  private initSampleData() {
    // Add admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "password123", // in a real app, this would be hashed
    };
    this.createUser(adminUser);

    // Add categories
    const dataEngCategory: InsertCategory = {
      name: "Data Engineering",
      slug: "data-engineering",
      description: "Data pipelines, ETL processes, and data architecture best practices.",
      icon: "database",
      color: "blue",
    };
    const mlCategory: InsertCategory = {
      name: "Machine Learning",
      slug: "machine-learning",
      description: "ML algorithms, model training, and practical applications of AI.",
      icon: "brain",
      color: "purple",
    };
    const dataVizCategory: InsertCategory = {
      name: "Data Visualization",
      slug: "data-visualization",
      description: "Creating effective dashboards and visualization techniques.",
      icon: "chart-line",
      color: "green",
    };
    const cloudCategory: InsertCategory = {
      name: "Cloud Solutions",
      slug: "cloud-solutions",
      description: "Cloud-based data platforms, serverless architectures, and more.",
      icon: "cloud",
      color: "red",
    };

    const categories = [
      dataEngCategory,
      mlCategory,
      dataVizCategory,
      cloudCategory
    ];

    const categoryIds: Record<string, number> = {};
    
    // Add categories and store their IDs
    categories.forEach(async (category) => {
      const createdCategory = await this.createCategory(category);
      categoryIds[category.slug] = createdCategory.id;
    });

    // Add tags
    const tags = [
      { name: "ETL", slug: "etl" },
      { name: "PyTorch", slug: "pytorch" },
      { name: "Tableau", slug: "tableau" },
      { name: "BigData", slug: "big-data" },
      { name: "Deep Learning", slug: "deep-learning" },
      { name: "D3.js", slug: "d3js" },
      { name: "AWS", slug: "aws" },
      { name: "NLP", slug: "nlp" }
    ];

    const tagIds: Record<string, number> = {};
    
    // Add tags and store their IDs
    tags.forEach(async (tag) => {
      const insertTag: InsertTag = {
        name: tag.name,
        slug: tag.slug
      };
      const createdTag = await this.createTag(insertTag);
      tagIds[tag.slug] = createdTag.id;
    });

    // Blog posts
    setTimeout(async () => {
      // We need to wait for the categories to be created
      // Featured Posts
      const post1: InsertPost = {
        title: "Building Resilient Data Pipelines with Apache Airflow",
        slug: "building-resilient-data-pipelines-apache-airflow",
        excerpt: "Learn how to design and implement fault-tolerant data pipelines that can handle upstream system failures gracefully.",
        content: `
# Building Resilient Data Pipelines with Apache Airflow

Data pipelines are the backbone of any data-driven organization, ensuring that data flows smoothly from source systems to analytical environments. However, in real-world scenarios, these pipelines often face numerous challenges - upstream systems fail, APIs go down, or network issues cause interruptions.

## The Need for Resilience

Resilient data pipelines don't just function when everything is working correctly; they gracefully handle failures and recover without manual intervention. This is where Apache Airflow shines as an orchestration tool.

## Key Strategies for Building Resilient Airflow Pipelines

### 1. Implementing Proper Retry Mechanisms

Airflow allows you to configure retries at both the task and DAG level:

\`\`\`python
# Task-level retry
task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_function,
    retries=3,
    retry_delay=timedelta(minutes=5)
)

# DAG-level default retries
with DAG(
    'data_pipeline',
    default_args={
        'retries': 3,
        'retry_delay': timedelta(minutes=5)
    }
) as dag:
    # Tasks inherit the retry configuration
    task = PythonOperator(...)
\`\`\`

### 2. Implementing Circuit Breakers

Circuit breakers prevent cascading failures by failing fast when a system is known to be down:

\`\`\`python
def check_api_status():
    # Logic to check if API is responsive
    return is_api_available

def extract_data(**context):
    if not check_api_status():
        raise AirflowSkipException("API unavailable, skipping extraction")
    # Proceed with extraction

check_task = PythonOperator(
    task_id='check_api_status',
    python_callable=check_api_status
)

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data
)

check_task >> extract_task
\`\`\`

### 3. Implementing Dead Letter Queues

When data processing fails after multiple retries, it's often better to move the problematic records to a dead letter queue for later analysis:

\`\`\`python
def process_data(**context):
    try:
        # Process data
        process_records(records)
    except Exception as e:
        # Move failed records to dead letter queue
        store_failed_records(records, str(e))
        # Depending on severity, you might want to fail the task
        # or just log and continue
        context['ti'].xcom_push(key='failed_count', value=len(failed_records))
\`\`\`

### 4. Implementing Idempotent Operations

Ensure tasks can be safely re-executed without causing duplicate data or side effects:

\`\`\`python
def idempotent_load(**context):
    # Get execution date to create a unique batch ID
    execution_date = context['execution_date']
    batch_id = f"batch_{execution_date.strftime('%Y%m%d%H%M')}"
    
    # Check if this batch was already processed
    if not batch_already_processed(batch_id):
        # Process and mark as complete
        process_batch(batch_id)
        mark_batch_complete(batch_id)
    else:
        logging.info(f"Batch {batch_id} already processed, skipping")
\`\`\`

## Monitoring and Alerting

A resilient pipeline needs proper monitoring:

1. Set up SLAs for critical tasks
2. Configure email or Slack alerts for failures
3. Monitor task duration and resource utilization
4. Implement custom sensors for external dependencies

## Conclusion

Building resilient data pipelines is not just about handling failures but designing systems that anticipate problems and recover gracefully. By implementing proper retry mechanisms, circuit breakers, dead letter queues, and idempotent operations, you can create data pipelines that maintain data integrity even when underlying systems fail.

Remember, the goal is not to prevent all failures—that's impossible in distributed systems—but to ensure that your data pipeline can recover without manual intervention and without compromising data quality.
`,
        coverImage: "https://images.unsplash.com/photo-1551434678-e076c223a692",
        publishedAt: new Date("2023-05-12"),
        featured: true,
        readingTime: 8,
        categoryId: categoryIds["data-engineering"],
        authorId: 1,
      };

      const post2: InsertPost = {
        title: "Neural Network Architectures for Time Series Forecasting",
        slug: "neural-network-architectures-time-series-forecasting",
        excerpt: "Comparing the effectiveness of LSTM, GRU, and Transformer models for predicting complex time-dependent patterns.",
        content: `
# Neural Network Architectures for Time Series Forecasting

Time series forecasting is a critical component in many domains, from financial market prediction to demand forecasting in supply chains. With the advancement of deep learning, neural network architectures have demonstrated significant improvements over traditional statistical methods.

## Understanding Time Series Challenges

Time series data presents unique challenges:

- Temporal dependencies (short and long-term)
- Seasonality and trends
- Irregular patterns and outliers
- Multiple interacting variables

## Key Neural Network Architectures

### LSTM (Long Short-Term Memory)

LSTMs have been the traditional workhorse for sequence modeling, with their ability to maintain memory over long sequences:

\`\`\`python
import tensorflow as tf
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential

model = Sequential([
    LSTM(units=50, return_sequences=True, input_shape=(lookback, features)),
    LSTM(units=50),
    Dense(units=forecasting_horizon)
])
\`\`\`

**Advantages:**
- Handles long-term dependencies
- Mitigates vanishing gradient problem
- Well-established in time series forecasting

**Limitations:**
- Computationally expensive
- Sequential processing limits parallelization
- Can struggle with very long sequences

### GRU (Gated Recurrent Unit)

GRUs simplify the LSTM architecture while maintaining performance in many scenarios:

\`\`\`python
model = Sequential([
    GRU(units=50, return_sequences=True, input_shape=(lookback, features)),
    GRU(units=50),
    Dense(units=forecasting_horizon)
])
\`\`\`

**Advantages:**
- Faster training than LSTM
- Fewer parameters
- Often comparable performance to LSTM

**Limitations:**
- Less expressive than LSTM in some complex tasks
- Still sequential in nature

### Transformer-based Models

Transformers have revolutionized NLP and are now making waves in time series:

\`\`\`python
class TimeSeriesTransformer(tf.keras.Model):
    def __init__(self, num_layers, d_model, num_heads, dff, input_seq_len, 
                 output_seq_len, input_dim, dropout_rate=0.1):
        super().__init__()
        
        self.encoder = Encoder(num_layers, d_model, num_heads, dff,
                              input_seq_len, input_dim, dropout_rate)
        
        self.final_layer = tf.keras.layers.Dense(output_seq_len)
        
    def call(self, inputs, training):
        # inputs shape: (batch_size, input_seq_len, input_dim)
        
        # encoder output shape: (batch_size, input_seq_len, d_model)
        encoder_output = self.encoder(inputs, training)
        
        # Global average pooling over sequence dimension
        pooled = tf.reduce_mean(encoder_output, axis=1)
        
        # final shape: (batch_size, output_seq_len)
        output = self.final_layer(pooled)
        
        return output
\`\`\`

**Advantages:**
- Parallel processing capabilities
- Self-attention captures dependencies at all time steps
- Superior performance on many complex tasks
- Handles multiple variables and interactions well

**Limitations:**
- Quadratic complexity with sequence length
- Requires more data to train effectively
- More hyperparameters to tune

## Empirical Comparison

In our experiments with electricity demand forecasting, we compared these architectures across several metrics:

| Model | MAE | RMSE | Training Time | Inference Time |
|-------|-----|------|--------------|---------------|
| LSTM  | 15.2| 19.8 | 45 min       | 12ms          |
| GRU   | 15.8| 20.1 | 32 min       | 10ms          |
| Transformer | 13.6| 17.5 | 68 min  | 8ms           |

The Transformer model showed approximately 10% improvement in forecasting accuracy but required more training time and tuning.

## Best Practices

1. **Data Preprocessing:**
   - Normalization is critical
   - Consider decomposing seasonality and trends
   - Feature engineering still matters

2. **Architecture Selection:**
   - For short sequences (< 100 time steps): GRU is often sufficient
   - For long dependencies: LSTM or Transformer
   - When parallel training is important: Transformer
   - When interpretability matters: Attention-based models

3. **Training Strategies:**
   - Use teacher forcing during training
   - Consider curriculum learning for long sequences
   - Validate on rolling windows, not random splits

## Conclusion

The choice of neural network architecture should depend on your specific time series characteristics. While Transformers show promising results and are likely the future of time series forecasting, LSTMs and GRUs remain solid choices for many applications, especially with limited data.

In our next post, we'll dive deeper into practical implementations and hyperparameter tuning for these models.
`,
        coverImage: "https://images.unsplash.com/photo-1527474305487-b87b222841cc",
        publishedAt: new Date("2023-04-30"),
        featured: true,
        readingTime: 12,
        categoryId: categoryIds["machine-learning"],
        authorId: 1,
      };

      const post3: InsertPost = {
        title: "Building Interactive Executive Dashboards That Drive Decisions",
        slug: "building-interactive-executive-dashboards-drive-decisions",
        excerpt: "How to design data visualizations that help stakeholders quickly understand complex metrics and make informed business decisions.",
        content: `
# Building Interactive Executive Dashboards That Drive Decisions

In today's data-driven business environment, executives are inundated with information but often struggle to extract actionable insights. An effective executive dashboard bridges this gap by transforming complex data into clear, actionable visualizations.

## Understanding Your Audience

Executive dashboards differ from operational dashboards in their focus and scope:

- **Executive Focus**: High-level KPIs and strategic metrics
- **Synthesis**: Summarizing complex data into digestible insights
- **Decision Support**: Enabling data-driven strategic decisions

## Key Dashboard Design Principles

### 1. Clarity Over Complexity

Executive dashboards should prioritize clarity above all:

- Limit to 5-7 key metrics on a single view
- Present information in a logical hierarchy
- Use consistent visual language throughout

### 2. Progressive Disclosure

Layer information to allow executives to explore details as needed:

\`\`\`javascript
// Example implementation in D3.js for drill-down functionality
function createDrillDownChart() {
  const topLevelData = aggregateByDepartment(data);
  
  // Render initial chart with top-level data
  const chart = renderBarChart(topLevelData);
  
  // Add drill-down interaction
  chart.selectAll('rect')
    .on('click', function(event, d) {
      const detailedData = getDetailedData(d.department);
      updateChartWithDetails(detailedData);
      
      // Add breadcrumb navigation
      addBreadcrumb(d.department, () => resetToTopLevel());
    });
}
\`\`\`

### 3. Contextual Information

Metrics alone are not enough—provide context for interpretation:

- Include historical trends
- Show targets or benchmarks
- Indicate performance thresholds with clear visual cues

### 4. Actionable Insights

Design dashboards that answer "So what?" and suggest "What next?":

- Highlight anomalies and exceptions
- Incorporate predictive elements
- Suggest potential actions based on current trends

## Technical Implementation

### Choosing the Right Visualization Types

Match visualization types to the nature of your data:

1. **KPI Cards**: For headline numbers and simple comparisons
2. **Line Charts**: For trends over time
3. **Bar Charts**: For comparisons across categories
4. **Heatmaps**: For showing patterns across multiple variables
5. **Scatter Plots**: For relationship analysis

Example of a KPI card component implementation:

\`\`\`javascript
function KpiCard({ title, value, previousValue, format = 'number', trend = true }) {
  const formattedValue = formatValue(value, format);
  const percentChange = calculatePercentChange(value, previousValue);
  const direction = getChangeDirection(percentChange);
  
  return (
    '<div className="kpi-card">' +
      '<h3 className="kpi-title">' + title + '</h3>' +
      '<div className="kpi-value">' + formattedValue + '</div>' +
      (trend ? 
        '<div className="kpi-trend ' + direction + '">' +
          (direction === 'up' ? '↑' : '↓') + ' ' + Math.abs(percentChange).toFixed(1) + '%' +
        '</div>'
      : '') +
    '</div>'
  );
}
\`\`\`

### Interactive Features That Matter

Interactivity should enhance understanding, not distract:

1. **Filtering**: Allow executives to focus on specific segments
2. **Tooltips**: Provide details on demand
3. **Time Period Selection**: Enable flexible time horizon analysis
4. **Drill-downs**: Permit exploration from summary to detail
5. **Scenario Analysis**: When appropriate, allow "what-if" modeling

## Case Study: Revenue Performance Dashboard

We developed an executive dashboard for a SaaS company that integrated the following elements:

1. **Top-level KPIs**: MRR, Customer Acquisition Cost, Churn Rate
2. **Cohort Analysis**: Customer retention by acquisition channel
3. **Geographic Breakdown**: Revenue by region with drill-down capability
4. **Sales Pipeline**: Conversion rates at each stage
5. **Customer Health**: Distribution of customers by health score

This dashboard enabled the executive team to:

- Identify that customers acquired through Partner channels had 30% higher lifetime value
- Recognize a concerning trend in the Enterprise segment churn rate
- Reallocate marketing budget to high-performing regions
- Adjust sales team structure based on pipeline bottlenecks

## Implementation Best Practices

1. **Mobile Optimization**: Ensure dashboards work on tablets and mobile devices
2. **Performance**: Optimize for fast loading and interaction
3. **Automated Updates**: Schedule regular data refreshes
4. **Alerts**: Implement notification systems for critical changes
5. **User Training**: Provide context and education for maximum value

## Conclusion

Effective executive dashboards aren't just about beautiful visualizations—they're about translating complex data into clear insights that drive strategic decisions. By following these principles, you can create dashboards that executives actually use and value rather than dashboards that collect digital dust.

Remember that dashboard design is iterative. Start with a minimal viable dashboard, gather feedback, and continuously refine based on how executives actually use the tool.
`,
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        publishedAt: new Date("2023-04-18"),
        featured: true,
        readingTime: 10,
        categoryId: categoryIds["data-visualization"],
        authorId: 1,
      };

      // Latest posts (not featured)
      const post4: InsertPost = {
        title: "Optimizing Spark Jobs for Large-Scale Data Processing",
        slug: "optimizing-spark-jobs-large-scale-data-processing",
        excerpt: "Learn advanced techniques to improve the performance of your Spark applications when processing terabytes of data.",
        content: `
# Optimizing Spark Jobs for Large-Scale Data Processing

When processing terabytes or petabytes of data, Apache Spark is often the tool of choice for data engineers. However, without proper optimization, Spark jobs can be slow, inefficient, and expensive. This post covers advanced techniques to optimize your Spark applications for large-scale data processing.

## Understanding Spark's Execution Model

Before optimizing Spark, it's crucial to understand how it executes jobs:

1. **Driver Program**: Coordinates the execution and holds the SparkContext
2. **Executors**: Worker processes that execute tasks
3. **Tasks**: Individual units of work assigned to executors
4. **Stages**: Sets of tasks that can be executed in parallel
5. **Jobs**: Sets of stages triggered by actions

Optimization targets each of these components to improve overall performance.

## Memory Management Techniques

### 1. Right-sizing Executor Memory

Configure executor memory based on your workload:

\`\`\`scala
// Example configuration
spark.conf.set("spark.executor.memory", "16g")
spark.conf.set("spark.executor.memoryOverhead", "4g")
\`\`\`

Guidelines:
- Aim for executor sizes between 4-16GB for most workloads
- Set memory overhead to ~10-15% of executor memory
- Consider YARN or Kubernetes container limitations

### 2. Managing Spill to Disk

When operations exceed available memory, Spark spills to disk, severely impacting performance:

\`\`\`scala
// Configure spill settings
spark.conf.set("spark.shuffle.file.buffer", "1m")
spark.conf.set("spark.shuffle.spill.compress", "true")
spark.conf.set("spark.shuffle.compress", "true")
\`\`\`

### 3. Caching Strategies

Be strategic about what and how you cache:

\`\`\`scala
// Cache levels
val df1 = spark.read.parquet("path/to/data")
  .filter(col("date") > "2023-01-01")
  .cache() // MEMORY_AND_DISK by default

// Or with specific storage level
import org.apache.spark.storage.StorageLevel
val df2 = spark.read.parquet("path/to/other/data")
  .persist(StorageLevel.MEMORY_ONLY_SER)
\`\`\`

Rule of thumb: Only cache RDDs/DataFrames that:
1. Are reused multiple times
2. Are expensive to recompute
3. Fit reasonably in memory after filtering/transformations

## Partitioning Strategies

### 1. Input Partitioning

Control how data is read into Spark:

\`\`\`scala
// Adjust parallelism when reading
val df = spark.read
  .option("maxPartitions", 1000)
  .parquet("s3://bucket/path/")

// Or repartition after reading
val repartitioned = df.repartition(numPartitions)
\`\`\`

### 2. Shuffle Partitioning

Tune shuffle operations based on data volume:

\`\`\`scala
// For large shuffles (>10GB)
spark.conf.set("spark.sql.shuffle.partitions", 1000)

// For medium datasets, calculate based on data size
val targetSize = 128 * 1024 * 1024 // 128MB per partition
val numPartitions = Math.max(df.count() * avgRecordSize / targetSize, 200).toInt
\`\`\`

### 3. Partition Pruning

Leverage partitioning in your storage format:

\`\`\`scala
// Create partitioned table
df.write
  .partitionBy("year", "month", "day")
  .parquet("path/to/partitioned/data")

// Query with partition filters
val result = spark.read.parquet("path/to/partitioned/data")
  .filter(col("year") === 2023 && col("month") === 6)
\`\`\`

## Join Optimizations

Join operations are often the most expensive part of Spark jobs:

### 1. Broadcast Joins

Use broadcast joins for small-large table combinations:

\`\`\`scala
// Explicit broadcast
import org.apache.spark.sql.functions.broadcast
val joined = largeDF.join(broadcast(smallDF), "join_key")

// Or set broadcast threshold
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "100m")
\`\`\`

### 2. Salting for Skewed Joins

When data is skewed, consider salting the join keys:

\`\`\`scala
// Create salted key for skewed values
val saltFactor = 10
val skewedDF = df1.withColumn("salt", (rand() * saltFactor).cast("int"))
val replicatedDF = df2.withColumn("tmp", explode(array((0 until saltFactor).map(lit): _*)))
  .withColumnRenamed("join_key", "original_key")
  .withColumn("join_key", concat(col("original_key"), col("tmp")))

// Join on salted keys
val joinedDF = skewedDF.join(replicatedDF, 
  skewedDF("join_key") === replicatedDF("join_key") && 
  skewedDF("salt") === replicatedDF("tmp"))
\`\`\`

## Data Format Optimizations

### 1. File Format Selection

Choose the right file format:

- **Parquet**: Columnar format ideal for analytical queries
- **ORC**: Another columnar format with good compression
- **Avro**: Better for schema evolution and streaming
- **JSON/CSV**: Only for interoperability, avoid for internal storage

### 2. Compression Codec Selection

\`\`\`scala
spark.conf.set("spark.sql.parquet.compression.codec", "snappy")
// Options: none, snappy, gzip, lzo, brotli, lz4, zstd

// Writing with specific compression
df.write
  .option("compression", "zstd")
  .parquet("path/to/output")
\`\`\`

General guidelines:
- **Snappy/LZ4**: Fast compression/decompression, moderate ratio
- **Zstd**: Good balance of speed and compression ratio
- **Gzip**: Higher compression ratio, slower decompression

### 3. Predicate Pushdown and Column Pruning

Leverage optimizations that push filters down to data sources:

\`\`\`scala
// This pushes filters and column selection to the Parquet reader
val optimizedRead = spark.read.parquet("path/to/data")
  .select("id", "name", "value") // Column pruning
  .filter(col("value") > 100)    // Predicate pushdown
\`\`\`

## Monitoring and Tuning

### 1. Spark UI

Key metrics to watch:
- Shuffle read/write sizes
- Spill metrics
- Stage skew (look for outlier task durations)
- Memory usage patterns

### 2. Execution Plans

Analyze execution plans to identify optimization opportunities:

\`\`\`scala
// View logical and physical plans
df.explain(true)
\`\`\`

Look for:
- Unexpected full table scans
- Missed broadcast opportunities
- Cartesian products (often a mistake)
- Exchange (shuffle) operations

## Real-World Optimization Example

We recently optimized a daily ETL job that processes 5TB of event data:

**Before Optimization:**
- Runtime: 4 hours
- Cost: ~$120/day (30 r5.2xlarge instances)
- Failures: Occasional OOM errors

**Optimizations Applied:**
1. Partitioned source data by event_date and event_type
2. Adjusted executor memory from 8GB to I4GB with 2GB overhead
3. Used Zstd compression for intermediate and final outputs
4. Broadcast small dimension tables (under 200MB)
5. Implemented salting for a particularly skewed join
6. Replaced several UDFs with built-in functions

**After Optimization:**
- Runtime: 55 minutes (4.4x improvement)
- Cost: ~$30/day (15 r5.2xlarge instances)
- Reliability: No failures in 90+ days

## Conclusion

Optimizing Spark jobs is both art and science. Start by understanding your data and workload patterns, then methodically apply these techniques while measuring their impact. Remember that optimization is iterative—make one change at a time and validate its effect before moving to the next optimization.

The most important advice: profile before optimizing. The Spark UI and execution plans are your best friends in identifying the true bottlenecks rather than making educated guesses.
`,
        coverImage: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
        publishedAt: new Date("2023-06-02"),
        featured: false,
        readingTime: 15,
        categoryId: categoryIds["data-engineering"],
        authorId: 1,
      };

      const post5: InsertPost = {
        title: "Implementing Transformer Models for Natural Language Processing Tasks",
        slug: "implementing-transformer-models-nlp-tasks",
        excerpt: "A step-by-step guide to building and fine-tuning transformer-based models for text classification, sentiment analysis, and named entity recognition using PyTorch and Hugging Face.",
        content: `
# Implementing Transformer Models for Natural Language Processing Tasks

Transformer models have revolutionized Natural Language Processing (NLP), achieving state-of-the-art results on virtually every language task. This guide walks through implementing transformer models for three common NLP tasks: text classification, sentiment analysis, and named entity recognition (NER).

## Understanding Transformer Architecture

Before diving into implementation, let's understand the key components of transformer models:

1. **Self-Attention Mechanism**: Allows the model to weigh the importance of words in relation to each other
2. **Multi-Head Attention**: Enables the model to focus on different aspects of the input simultaneously
3. **Positional Encoding**: Provides information about word order in the sequence
4. **Feed-Forward Networks**: Process the contextualized representations

## Setting Up Your Development Environment

First, let's set up a proper environment with PyTorch and Hugging Face's Transformers library:

\`\`\`bash
# Create a virtual environment
python -m venv transformer-env
source transformer-env/bin/activate  # On Windows: transformer-env\\Scripts\\activate

# Install required packages
pip install torch torchvision
pip install transformers datasets evaluate accelerate
pip install seqeval  # For NER evaluation
pip install tensorboard  # For visualization
\`\`\`

## Text Classification Implementation

Let's implement a text classification model to categorize news articles into categories:

### 1. Data Preparation

\`\`\`python
from datasets import load_dataset
from transformers import AutoTokenizer

# Load dataset (AG News as an example)
dataset = load_dataset("ag_news")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=128)

tokenized_datasets = dataset.map(tokenize_function, batched=True)
tokenized_datasets = tokenized_datasets.remove_columns(["text"])
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch")

# Create dataloaders
from torch.utils.data import DataLoader
train_dataloader = DataLoader(tokenized_datasets["train"], batch_size=16, shuffle=True)
eval_dataloader = DataLoader(tokenized_datasets["test"], batch_size=16)
\`\`\`

### 2. Model Setup and Training

\`\`\`python
from transformers import AutoModelForSequenceClassification, AdamW, get_scheduler
import torch
from tqdm.auto import tqdm

# Initialize model
num_labels = 4  # Number of classes in AG News
model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=num_labels
)

# Training setup
optimizer = AdamW(model.parameters(), lr=5e-5)

num_epochs = 3
num_training_steps = num_epochs * len(train_dataloader)
lr_scheduler = get_scheduler(
    name="linear",
    optimizer=optimizer,
    num_warmup_steps=0,
    num_training_steps=num_training_steps
)

device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
model.to(device)

# Training loop
progress_bar = tqdm(range(num_training_steps))

model.train()
for epoch in range(num_epochs):
    for batch in train_dataloader:
        batch = {k: v.to(device) for k, v in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        
        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)

# Evaluation
import evaluate
metric = evaluate.load("accuracy")

model.eval()
for batch in eval_dataloader:
    batch = {k: v.to(device) for k, v in batch.items()}
    with torch.no_grad():
        outputs = model(**batch)
    
    logits = outputs.logits
    predictions = torch.argmax(logits, dim=-1)
    metric.add_batch(predictions=predictions, references=batch["labels"])

print(f"Accuracy: {metric.compute()}")
\`\`\`

## Sentiment Analysis Implementation

Sentiment analysis determines the emotional tone behind text. Let's implement it:

### 1. Data Preparation

\`\`\`python
# Load IMDB dataset
dataset = load_dataset("imdb")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)

tokenized_datasets = dataset.map(tokenize_function, batched=True)
tokenized_datasets = tokenized_datasets.remove_columns(["text"])
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch")

# Create dataloaders (same as before)
\`\`\`

### 2. Model Setup with DistilBERT

\`\`\`python
# Use DistilBERT for sentiment analysis (smaller, faster)
model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased", num_labels=2
)

# Training and evaluation (similar to text classification)
\`\`\`

### 3. Making Predictions with Confidence Scores

\`\`\`python
import torch.nn.functional as F

def predict_sentiment(text, model, tokenizer, device):
    # Tokenize input
    inputs = tokenizer(text, padding="max_length", truncation=True, 
                      max_length=512, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    # Get prediction
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
    
    probabilities = F.softmax(outputs.logits, dim=-1)
    confidence, predicted_class = torch.max(probabilities, dim=-1)
    
    sentiment = "Positive" if predicted_class.item() == 1 else "Negative"
    
    return {
        "sentiment": sentiment,
        "confidence": confidence.item(),
        "probabilities": {
            "negative": probabilities[0][0].item(),
            "positive": probabilities[0][1].item()
        }
    }

# Example usage
text = "The movie was absolutely fantastic! The acting and direction were superb."
result = predict_sentiment(text, model, tokenizer, device)
print(result)
\`\`\`

## Named Entity Recognition (NER) Implementation

NER identifies entities like people, organizations, and locations in text:

### 1. Data Preparation for NER

\`\`\`python
from datasets import load_dataset
from transformers import AutoTokenizer

# Load CoNLL-2003 dataset
datasets = load_dataset("conll2003")
tokenizer = AutoTokenizer.from_pretrained("bert-base-cased")

# NER requires special tokenization handling to align subwords with labels
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(
        examples["tokens"], truncation=True, is_split_into_words=True
    )
    
    labels = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        
        for word_idx in word_ids:
            # Special tokens have word_id == None
            if word_idx is None:
                label_ids.append(-100)
            # First token of a word
            elif word_idx != previous_word_idx:
                label_ids.append(label[word_idx])
            # Part of a word after the first token
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx
            
        labels.append(label_ids)
    
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

tokenized_datasets = datasets.map(tokenize_and_align_labels, batched=True)
tokenized_datasets = tokenized_datasets.remove_columns(["tokens", "pos_tags", "chunk_tags", "ner_tags", "id"])
tokenized_datasets.set_format("torch")

# Create dataloaders (similar to previous examples)
\`\`\`

### 2. Model Setup and Training for NER

\`\`\`python
from transformers import AutoModelForTokenClassification

# The CoNLL-2003 dataset has 9 NER classes
model = AutoModelForTokenClassification.from_pretrained(
    "bert-base-cased", num_labels=9
)

# Training code (similar to previous examples)
\`\`\`

### 3. Entity Extraction Function

\`\`\`python
def extract_entities(text, model, tokenizer, device, id2label):
    # Tokenize input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, 
                      return_offsets_mapping=True)
    offset_mapping = inputs.pop("offset_mapping").tolist()[0]
    
    for k, v in inputs.items():
        inputs[k] = v.to(device)
    
    # Get predictions
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
    
    # Get predicted entity classes
    predictions = torch.argmax(outputs.logits, dim=-1)
    predicted_token_classes = [id2label[p.item()] for p in predictions[0]]
    
    # Combine tokens into entities
    entities = []
    current_entity = None
    
    for idx, (token_class, (start, end)) in enumerate(zip(predicted_token_classes, offset_mapping)):
        # Skip special tokens and subword continuations
        if start == 0 and end == 0:
            continue
        
        # B- prefix indicates beginning of entity
        if token_class.startswith("B-"):
            if current_entity:
                entities.append(current_entity)
            
            entity_type = token_class[2:]  # Remove B- prefix
            current_entity = {
                "entity": text[start:end],
                "type": entity_type,
                "start": start,
                "end": end
            }
        
        # I- prefix indicates continuation of entity
        elif token_class.startswith("I-") and current_entity:
            entity_type = token_class[2:]  # Remove I- prefix
            
            # Only continue if entity type matches
            if entity_type == current_entity["type"]:
                current_entity["entity"] = text[current_entity["start"]:end]
                current_entity["end"] = end
        
        # O indicates outside of entity
        else:
            if current_entity:
                entities.append(current_entity)
                current_entity = None
    
    # Add the last entity if exists
    if current_entity:
        entities.append(current_entity)
    
    return entities

# Example usage
id2label = {0: "O", 1: "B-PER", 2: "I-PER", 3: "B-ORG", 4: "I-ORG", 
            5: "B-LOC", 6: "I-LOC", 7: "B-MISC", 8: "I-MISC"}

text = "Satya Nadella became the CEO of Microsoft in 2014, replacing Steve Ballmer."
entities = extract_entities(text, model, tokenizer, device, id2label)
print(entities)
\`\`\`

## Fine-tuning vs. Full Training

For most NLP tasks, fine-tuning a pre-trained model is more efficient than training from scratch:

### Transfer Learning Approach

\`\`\`python
from transformers import Trainer, TrainingArguments

def compute_metrics(eval_pred):
    # Custom metrics calculation
    predictions, labels = eval_pred
    predictions = predictions.argmax(axis=-1)
    
    # Filter out -100 labels (special tokens)
    mask = labels != -100
    labels = labels[mask]
    predictions = predictions[mask]
    
    # Calculate metrics
    accuracy = (predictions == labels).mean()
    return {"accuracy": accuracy}

# Set up training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    load_best_model_at_end=True,
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    compute_metrics=compute_metrics,
)

# Fine-tune model
trainer.train()

# Save model
model.save_pretrained("./my_fine_tuned_model")
tokenizer.save_pretrained("./my_fine_tuned_model")
\`\`\`

## Model Deployment Considerations

When deploying transformer models to production:

1. **Model Quantization**: Reduce model size and increase inference speed
   \`\`\`python
   from transformers import AutoModelForSequenceClassification
   
   # Load and quantize model
   model = AutoModelForSequenceClassification.from_pretrained("./my_fine_tuned_model")
   model = torch.quantization.quantize_dynamic(
       model, {torch.nn.Linear}, dtype=torch.qint8
   )
   \`\`\`

2. **ONNX Export**: Convert model for runtime optimization
   \`\`\`python
   import torch
   
   # Export to ONNX format
   dummy_input = torch.zeros(1, 128, dtype=torch.long)
   torch.onnx.export(
       model, 
       (dummy_input,), 
       "model.onnx",
       input_names=["input_ids"],
       output_names=["logits"],
       dynamic_axes={"input_ids": {0: "batch_size"}, "logits": {0: "batch_size"}}
   )
   \`\`\`

3. **API Development**: Create a REST API for model access
   \`\`\`python
   from fastapi import FastAPI
   from pydantic import BaseModel
   
   app = FastAPI()
   
   class TextInput(BaseModel):
       text: str
   
   @app.post("/predict")
   def predict(input_data: TextInput):
       result = predict_sentiment(input_data.text, model, tokenizer, device)
       return result
   \`\`\`

## Conclusion

Transformer models have democratized advanced NLP capabilities. With the Hugging Face ecosystem, implementing production-ready NLP solutions is more accessible than ever before. The techniques outlined in this guide provide a foundation for implementing text classification, sentiment analysis, and named entity recognition with state-of-the-art performance.

In future posts, we'll explore more advanced techniques like:
- Few-shot learning with transformers
- Domain adaptation for specialized language tasks
- Multi-lingual models and cross-lingual transfer
- Model distillation for more efficient deployment
`,
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        publishedAt: new Date("2023-05-28"),
        featured: false,
        readingTime: 18,
        categoryId: categoryIds["machine-learning"],
        authorId: 1,
      };

      const post6: InsertPost = {
        title: "Creating Interactive Data Visualizations with D3.js and React",
        slug: "creating-interactive-data-visualizations-d3js-react",
        excerpt: "Explore how to combine the power of D3.js with React to build reusable, interactive data visualization components that can handle real-time updates and complex user interactions.",
        content: `
# Creating Interactive Data Visualizations with D3.js and React

Data visualization is essential for communicating insights effectively. When building modern web applications, combining the declarative nature of React with the powerful visualization capabilities of D3.js creates a robust framework for interactive data visualizations.

## Understanding the React and D3 Integration Challenge

React and D3 both want to control the DOM, which creates integration challenges:

- **React** uses a virtual DOM and handles updates through its reconciliation process
- **D3** directly manipulates the DOM for precise control over transitions and interactions

## Integration Approaches

### 1. Let React Handle the DOM, D3 for Calculations

This approach uses D3 for calculations and React for rendering:

\`\`\`javascript
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function BarChart({ data }) {
  const [scales, setScales] = useState(null);
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
  useEffect(() => {
    // Use D3 for calculations only
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);
    
    setScales({ xScale, yScale });
  }, [data, width, height, margin]);
  
  if (!scales) return "Loading...";
  
  return (
    <svg width={width} height={height}>
      {/* X-axis */}
      <g transform={\`translate(0,\${height - margin.bottom})\`}>
        <line stroke="currentColor" x1={margin.left} x2={width - margin.right} y1={0} y2={0} />
        {data.map(d => (
          <text 
            key={d.name}
            x={scales.xScale(d.name) + scales.xScale.bandwidth() / 2}
            y={15}
            textAnchor="middle"
            fontSize={10}
          >
            {d.name}
          </text>
        ))}
      </g>
      
      {/* Y-axis */}
      <g transform={\`translate(\${margin.left},0)\`}>
        <line stroke="currentColor" y1={margin.top} y2={height - margin.bottom} x1={0} x2={0} />
        {scales.yScale.ticks(5).map(tick => (
          <g key={tick} transform={\`translate(0,\${scales.yScale(tick)})\`}>
            <line stroke="currentColor" x1={-6} x2={0} />
            <text x={-9} dy="0.32em" textAnchor="end" fontSize={10}>
              {tick}
            </text>
          </g>
        ))}
      </g>
      
      {/* Bars */}
      {data.map(d => (
        <rect
          key={d.name}
          x={scales.xScale(d.name)}
          y={scales.yScale(d.value)}
          width={scales.xScale.bandwidth()}
          height={height - margin.bottom - scales.yScale(d.value)}
          fill="steelblue"
        />
      ))}
    </svg>
  );
}
\`\`\`

This approach works well for simple visualizations but can become cumbersome for complex interactions.

### 2. Let D3 Handle a Specific DOM Node with useRef

Here, React creates a container and D3 manages everything inside it:

\`\`\`javascript
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function D3LineChart({ data }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);
    
    // Create line generator
    const line = d3.line()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add X-axis
    svg.append('g')
      .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
      .call(d3.axisBottom(xScale).ticks(5));
    
    // Add Y-axis
    svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',0)')
      .call(d3.axisLeft(yScale));
    
    // Add line path
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
    
    // Add tooltips with interaction
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '5px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('opacity', 0);
    
    const dots = svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(new Date(d.date)))
      .attr('cy', d => yScale(d.value))
      .attr('r', 4)
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(
          'Date: ' + new Date(d.date).toLocaleDateString() + '<br/>' +
          'Value: ' + d.value
        )
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    // Clean up function to remove tooltip when component unmounts
    return () => {
      d3.select('body').selectAll('.tooltip').remove();
    };
  }, [data]);
  
  return '<svg ref={svgRef}></svg>';
}
\`\`\`

This approach gives D3 full control over the visualization while React manages the component lifecycle.

### 3. Creating Reusable Visualization Components

For a production application, we want reusable components that integrate well with React's ecosystem:

\`\`\`javascript
import React, { useState } from 'react';
import { LineChart } from './charts/LineChart';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { DateRangePicker } from './controls/DateRangePicker';

function DashboardPage() {
  const [dateRange, setDateRange] = useState({ start: '2023-01-01', end: '2023-06-30' });
  const [revenueData, setRevenueData] = useState(/* empty array */);
  const [categoryData, setCategoryData] = useState(/* empty array */);
  
  // Update data when date range changes
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // Fetch new data based on date range
    fetchRevenueData(newRange).then(setRevenueData);
    fetchCategoryData(newRange).then(setCategoryData);
  };
  
  return (
    '<div className="dashboard">' +
      '<div className="dashboard-controls">' +
        '<DateRangePicker ' +
          'startDate={dateRange.start} ' +
          'endDate={dateRange.end} ' +
          'onChange={handleDateRangeChange} ' +
        '/>' +
      '</div>' +
      
      '<div className="dashboard-charts">' +
        '<div className="chart-container">' +
          '<h2>Revenue Over Time</h2>' +
          '<LineChart ' +
            'data={revenueData} ' +
            'xAccessor={d => new Date(d.date)} ' +
            'yAccessor={d => d.value} ' +
            'width={600} ' +
            'height={300} ' +
            'margin={{ top: 20, right: 30, bottom: 30, left: 40 }} ' +
            'color="#3366cc" ' +
            'animate={true} ' +
            'xLabel="Date" ' +
            'yLabel="Revenue ($)" ' +
          '/>' +
        '</div>' +
        
        '<div className="chart-container">' +
          '<h2>Revenue by Category</h2>' +
          '<BarChart ' +
            'data={categoryData} ' +
            'xAccessor={d => d.category} ' +
            'yAccessor={d => d.value} ' +
            'width={600} ' +
            'height={300} ' +
            'margin={{ top: 20, right: 30, bottom: 30, left: 40 }} ' +
            'color="#33cc99" ' +
            'animate={true} ' +
            'xLabel="Category" ' +
            'yLabel="Revenue ($)" ' +
          '/>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}
\`\`\`

## Building a Reusable Line Chart Component

Let's build a complete, reusable line chart component with animations and interactions:

\`\`\`javascript
// LineChart.jsx
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './LineChart.css';

export function LineChart({ 
  data,
  width = 600,
  height = 400,
  margin = { top: 20, right: 30, bottom: 50, left: 60 },
  xAccessor,
  yAccessor,
  xLabel,
  yLabel,
  color = 'steelblue',
  animate = true,
  animationDuration = 1000,
  showTooltip = true,
  onPointClick = null
}) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    // Setup
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create the scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, xAccessor))
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yAccessor) * 1.1]) // Add 10% padding
      .nice()
      .range([innerHeight, 0]);
    
    // Create the line generator
    const line = d3.line()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
      .curve(d3.curveMonotoneX);
    
    // Create container group
    const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    
    // Add X grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickFormat(''))
      .select('.domain').remove();
    
    // Add Y grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(''))
      .select('.domain').remove();
    
    // Add X-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + innerHeight + ')')
      .call(d3.axisBottom(xScale).ticks(5))
      .select('.domain')
      .attr('stroke', '#888');
    
    // Add X-axis label
    if (xLabel) {
      g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight + 40)
        .text(xLabel);
    }
    
    // Add Y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .select('.domain')
      .attr('stroke', '#888');
    
    // Add Y-axis label
    if (yLabel) {
      g.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerHeight / 2)
        .attr('y', -40)
        .text(yLabel);
    }
    
    // Add the line path with animation
    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Animate path drawing
    if (animate) {
      const pathLength = path.node().getTotalLength();
      path.attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(animationDuration)
        .attr('stroke-dashoffset', 0);
    }
    
    // Add interactive dots
    const dots = g.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(xAccessor(d)))
      .attr('cy', d => yScale(yAccessor(d)))
      .attr('r', 4)
      .attr('fill', color)
      .attr('opacity', 0) // Start invisible for animation
      .on('mouseover', (event, d) => {
        setHoveredPoint(d);
        d3.select(event.target)
          .transition()
          .duration(300)
          .attr('r', 7)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      })
      .on('mouseout', (event) => {
        setHoveredPoint(null);
        d3.select(event.target)
          .transition()
          .duration(300)
          .attr('r', 4)
          .attr('stroke', 'none');
      })
      .on('click', (event, d) => {
        if (onPointClick) onPointClick(d);
      });
    
    // Animate dots appearance
    if (animate) {
      dots.transition()
        .delay((d, i) => i * (animationDuration / data.length))
        .duration(300)
        .attr('opacity', 1);
    } else {
      dots.attr('opacity', 1);
    }
    
  }, [data, width, height, margin, xAccessor, yAccessor, color, animate, 
      animationDuration, xLabel, yLabel, onPointClick]);
  
  return '<div className="line-chart-container" style="position: relative"><svg ref="svgRef" width="' + width + '" height="' + height + '" className="line-chart"/></div>';
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.object,
  xAccessor: PropTypes.func.isRequired,
  yAccessor: PropTypes.func.isRequired,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  color: PropTypes.string,
  animate: PropTypes.bool,
  animationDuration: PropTypes.number,
  showTooltip: PropTypes.bool,
  onPointClick: PropTypes.func
};
\`\`\`

## Creating a Responsive Visualization

To make visualizations responsive:

\`\`\`javascript
import React, { useState, useEffect, useRef } from 'react';
import { LineChart } from './LineChart';

function ResponsiveLineChart(props) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Set height based on aspect ratio or fixed height
        const height = props.aspectRatio 
          ? width / props.aspectRatio 
          : props.height || 400;
        
        setDimensions({ width, height });
      }
    };
    
    // Initial sizing
    updateDimensions();
    
    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    
    // Clean up
    return () => window.removeEventListener('resize', updateDimensions);
  }, [props.aspectRatio, props.height]);
  
  return '<div>ResponsiveLineChart Component</div>';
}
\`\`\`

## Handling Real-time Data Updates

For real-time data visualizations:

\`\`\`javascript
import React, { useState, useEffect } from 'react';
import { ResponsiveLineChart } from './ResponsiveLineChart';

function RealTimeChart() {
  const [data, setData] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Simulate data stream
  useEffect(() => {
    if (!isStreaming) return;
    
    // Initial data
    if (data.length === 0) {
      const initialData = [];
      const now = new Date();
      
      // Generate some historical data
      for (let i = 20; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 1000);
        initialData.push({
          date,
          value: Math.random() * 100
        });
      }
      
      setData(initialData);
    }
    
    // Add new data points every second
    const interval = setInterval(() => {
      setData(currentData => {
        const newDate = new Date();
        const newPoint = {
          date: newDate,
          value: Math.random() * 100
        };
        
        // Keep only the most recent 20 points
        const newData = [...currentData, newPoint];
        if (newData.length > 20) {
          return newData.slice(newData.length - 20);
        }
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isStreaming, data.length]);
  
  return '<div className="real-time-chart">RealTimeChart Component</div>';
}
\`\`\`

## Conclusion

Integrating D3.js with React creates powerful, reusable visualization components. By understanding the strengths of each library, we can build interactive dashboards that are maintainable and performant.

The key takeaways are:

1. Use React for component management and D3 for visualization logic
2. Create reusable components with well-defined props
3. Handle responsiveness with container references and dimension detection
4. Manage animations appropriately, especially for real-time data
5. Provide rich interactions through tooltips and event handlers

In future posts, we'll explore more complex visualizations like geographic maps, network graphs, and hierarchical visualizations using this same integration pattern.
`,
        coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        publishedAt: new Date("2023-05-22"),
        featured: false,
        readingTime: 12,
        categoryId: categoryIds["data-visualization"],
        authorId: 1,
      };

      // Create featured posts
      await this.createPost(post1);
      await this.createPost(post2);
      await this.createPost(post3);

      // Create latest posts
      await this.createPost(post4);
      await this.createPost(post5);
      await this.createPost(post6);

      // Create projects
      const project1: InsertProject = {
        title: "Real-time Analytics Platform",
        slug: "real-time-analytics-platform",
        description: "Built a scalable, real-time data processing platform using Kafka, Spark Streaming, and AWS services to analyze user behavior for a SaaS product.",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
        technologies: ["Apache Kafka", "Spark", "S3"],
        categoryId: categoryIds["data-engineering"],
        featured: true,
        url: "https://github.com/example/real-time-analytics"
      };

      const project2: InsertProject = {
        title: "Sentiment Analysis API",
        slug: "sentiment-analysis-api",
        description: "Developed a multilingual sentiment analysis API that helps businesses analyze customer feedback across different languages with high accuracy.",
        coverImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
        technologies: ["PyTorch", "FastAPI", "Docker"],
        categoryId: categoryIds["machine-learning"],
        featured: true,
        url: "https://github.com/example/sentiment-analysis"
      };

      // Create projects
      await this.createProject(project1);
      await this.createProject(project2);

      // Create tags for post 1
      const etlTag = await this.getTagBySlug("etl");
      if (etlTag) {
        await this.createPostTag({
          postId: 1,
          tagId: etlTag.id
        });
      }

      // Create tags for post 2
      const pytorchTag = await this.getTagBySlug("pytorch");
      if (pytorchTag) {
        await this.createPostTag({
          postId: 2,
          tagId: pytorchTag.id
        });
      }

      // Create tags for post 3
      const tableauTag = await this.getTagBySlug("tableau");
      if (tableauTag) {
        await this.createPostTag({
          postId: 3,
          tagId: tableauTag.id
        });
      }

      // Repeat for other posts
    }, 500);
  }
}

export const storage = new MemStorage();
