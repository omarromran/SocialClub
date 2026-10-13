<?php
declare(strict_types=1);

// UI-only demo data. Replace with database queries and authorization in later backend phases.
$demoIsAdmin = true;
$demoUsers = [
    1 => ['id' => 1, 'username' => 'omarromran', 'name' => 'Omar Omran', 'bio' => 'Building thoughtful communities.', 'status' => 'Active'],
    2 => ['id' => 2, 'username' => 'layla_hassan', 'name' => 'Layla Hassan', 'bio' => 'Design, books, and good conversations.', 'status' => 'Active'],
    3 => ['id' => 3, 'username' => 'youssef_ali', 'name' => 'Youssef Ali', 'bio' => 'Technology and city walks.', 'status' => 'Active'],
];
$demoPosts = [
    1 => ['id' => 1, 'user_id' => 2, 'username' => 'layla_hassan', 'name' => 'Layla Hassan', 'content' => 'A small idea can become a strong community when people keep showing up.', 'created_at' => '2026-10-12 10:30:00', 'likes' => 18, 'comments' => 4],
    2 => ['id' => 2, 'user_id' => 3, 'username' => 'youssef_ali', 'name' => 'Youssef Ali', 'content' => 'What are you reading this week?', 'created_at' => '2026-10-11 16:10:00', 'likes' => 9, 'comments' => 2],
];
$demoComments = [
    ['username' => 'omarromran', 'content' => 'This is a great reminder.', 'created_at' => '2026-10-12 11:00:00'],
    ['username' => 'youssef_ali', 'content' => 'Absolutely agree.', 'created_at' => '2026-10-12 11:14:00'],
];
$demoNotifications = [
    ['type' => 'like', 'text' => 'Layla liked your post.', 'group' => 'Today', 'unread' => true],
    ['type' => 'comment', 'text' => 'Youssef commented on your post.', 'group' => 'Today', 'unread' => true],
    ['type' => 'follow', 'text' => 'Layla started following you.', 'group' => 'Earlier', 'unread' => false],
];
$demoConversations = [
    ['id' => 1, 'username' => 'layla_hassan', 'name' => 'Layla Hassan', 'preview' => 'That sounds good!', 'time' => '10:42 AM'],
    ['id' => 2, 'username' => 'youssef_ali', 'name' => 'Youssef Ali', 'preview' => 'See you soon.', 'time' => 'Yesterday'],
];
$demoMessages = [
    ['from' => 'layla_hassan', 'content' => 'Have you seen the new community page?', 'time' => '10:38 AM'],
    ['from' => 'me', 'content' => 'Not yet, I will check it today.', 'time' => '10:40 AM'],
    ['from' => 'layla_hassan', 'content' => 'That sounds good!', 'time' => '10:42 AM'],
];
$demoRequests = ['incoming' => [['username' => 'layla_hassan', 'name' => 'Layla Hassan']], 'sent' => [['username' => 'youssef_ali', 'name' => 'Youssef Ali']], 'friends' => [['username' => 'omarromran', 'name' => 'Omar Omran']]];
$demoReports = [['type' => 'Post', 'subject' => 'Reported text post', 'reported_by' => 'layla_hassan', 'status' => 'Pending'], ['type' => 'Comment', 'subject' => 'Reported comment', 'reported_by' => 'youssef_ali', 'status' => 'Pending']];
$demoSearchResults = ['people' => [$demoUsers[2], $demoUsers[3]], 'posts' => [$demoPosts[1], $demoPosts[2]]];
