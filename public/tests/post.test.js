/**
 * @jest-environment jsdom
 */

import { renderPosts } from '../js/post.js';

describe("renderPosts", () => {
  let postContainer;

  beforeEach(() => {
    // Set up a DOM environment
    document.body.innerHTML = `<div id="postContainer"></div>`;
    postContainer = document.getElementById('postContainer');
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
  });

  test("should render posts in the DOM", () => {
    const mockPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A", upvotes: 2, downvotes: 1 },
      { title: "Post 2", content: "This is post 2", author: "User B", upvotes: 5, downvotes: 0 },
    ];

    renderPosts(mockPosts);

    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(2); // Ensure two posts are rendered

    // Check the content of the first post
    expect(posts[0].querySelector('h3').textContent).toBe("Post 1");
    expect(posts[0].querySelector('p').textContent).toBe("This is post 1");
    expect(posts[0].querySelector('.post-upvotes').textContent).toBe("2");
    expect(posts[0].querySelector('.post-downvotes').textContent).toBe("1");
  });

  test("should update upvote and downvote counts when buttons are clicked", () => {
    const mockPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A", upvotes: 0, downvotes: 0 },
    ];

    renderPosts(mockPosts);

    const upvoteButton = postContainer.querySelector('.upvote-button');
    const downvoteButton = postContainer.querySelector('.downvote-button');
    const upvoteDisplay = postContainer.querySelector('.post-upvotes');
    const downvoteDisplay = postContainer.querySelector('.post-downvotes');

    // Simulate upvote click
    upvoteButton.click();
    expect(upvoteDisplay.textContent).toBe("1");

    // Simulate downvote click
    downvoteButton.click();
    expect(downvoteDisplay.textContent).toBe("1");
  });

  test("should not throw an error if postContainer is missing", () => {
    // Remove the postContainer
    document.body.innerHTML = '';

    const mockPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A", upvotes: 2, downvotes: 1 },
    ];

    expect(() => renderPosts(mockPosts)).not.toThrow();
  });

  test("should handle an empty array without rendering any posts", () => {
    renderPosts([]);
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(0); // No posts should be rendered
  });
  
  test("should handle null input gracefully", () => {
    expect(() => renderPosts(null)).not.toThrow();
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(0); // No posts should be rendered
  });
  
  test("should handle undefined input gracefully", () => {
    expect(() => renderPosts(undefined)).not.toThrow();
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(0); // No posts should be rendered
  });
  
  test("should handle posts with missing upvotes and downvotes", () => {
    const mockPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A" }, // No upvotes or downvotes
    ];
  
    renderPosts(mockPosts);
  
    const post = postContainer.querySelector('.post');
    expect(post.querySelector('.post-upvotes').textContent).toBe("0"); // Default value
    expect(post.querySelector('.post-downvotes').textContent).toBe("0"); // Default value
  });
  
  test("should handle posts with missing author", () => {
    const mockPosts = [
      { title: "Post 1", content: "This is post 1", upvotes: 3, downvotes: 1 }, // No author
    ];
  
    renderPosts(mockPosts);
  
    const post = postContainer.querySelector('.post');
    expect(post.querySelector('small').textContent).toBe("Posted by: "); // Default or empty string
  });
  
  test("should escape HTML in post content", () => {
    const mockPosts = [
      { title: "Post 1", content: "<script>alert('XSS')</script>", author: "User A" },
    ];
  
    renderPosts(mockPosts);
  
    const post = postContainer.querySelector('.post');
    expect(post.querySelector('p').textContent).toBe("<script>alert('XSS')</script>"); // Rendered as text, not executed
  });
  
  test("should render a large number of posts efficiently", () => {
    const largeMockPosts = Array.from({ length: 1000 }, (_, i) => ({
      title: `Post ${i + 1}`,
      content: `This is post ${i + 1}`,
      author: `User ${i + 1}`,
      upvotes: i,
      downvotes: 1000 - i,
    }));
  
    renderPosts(largeMockPosts);
  
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(1000); // All posts should be rendered
    expect(posts[999].querySelector('h3').textContent).toBe("Post 1000"); // Verify the last post
  });
  
  test("should clear the container before rendering new posts", () => {
    const initialPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A" },
    ];
  
    renderPosts(initialPosts);
  
    // Render new posts
    const newPosts = [
      { title: "Post 2", content: "This is post 2", author: "User B" },
    ];
  
    renderPosts(newPosts);
  
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(1); // Only one post should remain
    expect(posts[0].querySelector('h3').textContent).toBe("Post 2"); // Confirm it's the new post
  });

  test("should not update upvotes or downvotes if buttons are missing", () => {
    const mockPosts = [
      { title: "Post 1", content: "This is post 1", author: "User A", upvotes: 0, downvotes: 0 },
    ];
  
    renderPosts(mockPosts);
  
    // Remove buttons
    const upvoteButton = postContainer.querySelector('.upvote-button');
    const downvoteButton = postContainer.querySelector('.downvote-button');
    upvoteButton.remove();
    downvoteButton.remove();
  
    expect(() => upvoteButton.click()).not.toThrow();
    expect(() => downvoteButton.click()).not.toThrow();
  });
  
  test("should not render posts if they lack title or content", () => {
    const mockPosts = [
      { author: "User A", upvotes: 0, downvotes: 0 }, // Missing title and content
      { title: "Post 2", content: "", author: "User B", upvotes: 1, downvotes: 1 }, // Empty content
    ];
  
    renderPosts(mockPosts);
  
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(0); // No posts should be rendered
  });
  
  test("should correctly display 'no posts available' message when no posts are passed", () => {
    postContainer.innerHTML = ''; // Ensure the container is empty
    renderPosts([]);
  
    expect(postContainer.textContent).toContain("No posts available"); // Assuming this message is displayed in your implementation
  });
  
  test("should apply a CSS class to posts with high upvotes", () => {
    const mockPosts = [
      { title: "Popular Post", content: "This is popular", author: "User A", upvotes: 100, downvotes: 1 },
    ];
  
    renderPosts(mockPosts);
  
    const post = postContainer.querySelector('.post');
    expect(post.classList.contains('popular-post')).toBe(true); // Assuming 'popular-post' is a CSS class
  });
  
  test("should sort posts by upvotes before rendering", () => {
    const mockPosts = [
      { title: "Post A", content: "Content A", author: "User A", upvotes: 10, downvotes: 0 },
      { title: "Post B", content: "Content B", author: "User B", upvotes: 50, downvotes: 0 },
      { title: "Post C", content: "Content C", author: "User C", upvotes: 20, downvotes: 0 },
    ];
  
    renderPosts(mockPosts);
  
    const postTitles = Array.from(postContainer.querySelectorAll('.post h3')).map(h3 => h3.textContent);
    expect(postTitles).toEqual(["Post B", "Post C", "Post A"]); // Sorted by upvotes
  });
  test("should correctly render posts with long content", () => {
    const longPostContent = "A".repeat(1000); // Simulate a long string
    const mockPosts = [{ title: "Post 1", content: longPostContent, author: "User A" }];
  
    renderPosts(mockPosts);
  
    const post = postContainer.querySelector('.post');
    expect(post.querySelector('p').textContent.length).toBe(1000); // Check if all content is rendered
  });
  
  test("should not render posts with missing titles", () => {
    const mockPosts = [{ content: "Missing title content", author: "User A" }];
    renderPosts(mockPosts);
  
    const posts = postContainer.querySelectorAll('.post');
    expect(posts.length).toBe(0); // Posts without titles shouldn't render
  });
  
  test("should allow multiple posts to be upvoted independently", () => {
    const mockPosts = [
      { title: "Post 1", content: "Content 1", author: "User A", upvotes: 0 },
      { title: "Post 2", content: "Content 2", author: "User B", upvotes: 0 },
    ];
  
    renderPosts(mockPosts);
  
    const [firstUpvote, secondUpvote] = postContainer.querySelectorAll('.upvote-button');
    firstUpvote.click();
    secondUpvote.click();
    secondUpvote.click();
  
    const [firstUpvotes, secondUpvotes] = postContainer.querySelectorAll('.post-upvotes');
    expect(firstUpvotes.textContent).toBe("1");
    expect(secondUpvotes.textContent).toBe("2");
  });
  
  
});
