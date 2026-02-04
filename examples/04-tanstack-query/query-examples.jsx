// TanStack Query (React Query) - Complete Examples
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

// API functions
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const fetchUser = async (userId) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const fetchPosts = async (userId) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  return response.json();
};

const createPost = async (newPost) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  return response.json();
};

const updatePost = async ({ id, ...post }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  return response.json();
};

const deletePost = async (postId) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
    method: 'DELETE',
  });
  return response.json();
};

// ========================================
// 1. BASIC QUERY
// ========================================

function BasicQuery() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h3>All Users</h3>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 2. QUERY WITH PARAMETERS
// ========================================

function QueryWithParams() {
  const [userId, setUserId] = useState(1);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetchPosts(userId),
    enabled: !!userId, // Only run when userId exists
  });

  return (
    <div>
      <h3>User Details</h3>
      <div>
        <button onClick={() => setUserId(1)}>User 1</button>
        <button onClick={() => setUserId(2)}>User 2</button>
        <button onClick={() => setUserId(3)}>User 3</button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h4>{user?.name}</h4>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone}</p>

          <h4>Posts by {user?.name}</h4>
          <ul>
            {posts?.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ========================================
// 3. MUTATIONS (CREATE, UPDATE, DELETE)
// ========================================

function MutationsExample() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setBody('');
      alert('Post created!');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('Post updated!');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('Post deleted!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      body,
      userId: 1,
    });
  };

  return (
    <div>
      <h3>Create Post</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        </div>
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          />
        </div>
        <button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create Post'}
        </button>
      </form>

      {createMutation.isError && (
        <div style={{ color: 'red' }}>Error: {createMutation.error.message}</div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => updateMutation.mutate({ id: 1, title: 'Updated', body: 'Updated body', userId: 1 })}>
          Update Post 1
        </button>
        <button onClick={() => deleteMutation.mutate(1)}>
          Delete Post 1
        </button>
      </div>
    </div>
  );
}

// ========================================
// 4. OPTIMISTIC UPDATES
// ========================================

function OptimisticUpdates() {
  const queryClient = useQueryClient();

  const { data: posts } = useQuery({
    queryKey: ['posts', 1],
    queryFn: () => fetchPosts(1),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts', 1] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts', 1]);

      // Optimistically update
      queryClient.setQueryData(['posts', 1], (old) =>
        old?.filter((post) => post.id !== postId)
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts', 1], context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 1] });
    },
  });

  return (
    <div>
      <h3>Posts with Optimistic Delete</h3>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ========================================
// 5. POLLING (REFETCH INTERVAL)
// ========================================

function PollingExample() {
  const [enabled, setEnabled] = useState(true);

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: enabled ? 5000 : false, // Refetch every 5 seconds
    refetchIntervalInBackground: false, // Pause when tab is inactive
  });

  return (
    <div>
      <h3>Polling Example (Refetch every 5s)</h3>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Stop' : 'Start'} Polling
      </button>
      <p>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
      <p>Users count: {data?.length}</p>
    </div>
  );
}

// ========================================
// 6. INFINITE QUERY
// ========================================

const fetchInfinitePosts = async ({ pageParam = 1 }) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`
  );
  return response.json();
};

function InfiniteQueryExample() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['infinitePosts'],
    queryFn: fetchInfinitePosts,
    getNextPageParam: (lastPage, pages) => {
      // Return next page number if there are more posts
      return lastPage.length === 10 ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return (
    <div>
      <h3>Infinite Scroll Posts</h3>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.map((post) => (
            <div key={post.id} style={{ padding: '10px', border: '1px solid #ccc', margin: '5px 0' }}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No more posts'}
      </button>
    </div>
  );
}

// ========================================
// 7. DEPENDENT QUERIES
// ========================================

function DependentQueries() {
  const [userId, setUserId] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  const { data: posts } = useQuery({
    queryKey: ['userPosts', user?.id],
    queryFn: () => fetchPosts(user.id),
    enabled: !!user, // Only fetch when user is loaded
  });

  return (
    <div>
      <h3>Dependent Queries</h3>
      <button onClick={() => setUserId(1)}>Load User 1</button>
      <button onClick={() => setUserId(2)}>Load User 2</button>

      {user && (
        <>
          <h4>{user.name}</h4>
          <h5>Posts:</h5>
          <ul>
            {posts?.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ========================================
// 8. QUERY INVALIDATION
// ========================================

function QueryInvalidation() {
  const queryClient = useQueryClient();

  const { data, dataUpdatedAt } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <div>
      <h3>Query Invalidation</h3>
      <button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}>
        Invalidate & Refetch
      </button>
      <button onClick={() => queryClient.removeQueries({ queryKey: ['users'] })}>
        Remove from Cache
      </button>
      <p>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>
      <p>Users: {data?.length}</p>
    </div>
  );
}

// ========================================
// MAIN APP WITH PROVIDER
// ========================================

function TanStackQueryContent() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>TanStack Query Examples</h1>

      <section>
        <h2>1. Basic Query</h2>
        <BasicQuery />
      </section>

      <section>
        <h2>2. Query with Parameters</h2>
        <QueryWithParams />
      </section>

      <section>
        <h2>3. Mutations</h2>
        <MutationsExample />
      </section>

      <section>
        <h2>4. Optimistic Updates</h2>
        <OptimisticUpdates />
      </section>

      <section>
        <h2>5. Polling</h2>
        <PollingExample />
      </section>

      <section>
        <h2>6. Infinite Query</h2>
        <InfiniteQueryExample />
      </section>

      <section>
        <h2>7. Dependent Queries</h2>
        <DependentQueries />
      </section>

      <section>
        <h2>8. Query Invalidation</h2>
        <QueryInvalidation />
      </section>
    </div>
  );
}

export default function TanStackQueryExamples() {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackQueryContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

/*
INSTALLATION:
npm install @tanstack/react-query @tanstack/react-query-devtools
*/
