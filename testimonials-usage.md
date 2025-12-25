# Testimonials Section Usage Guide

This guide explains how to add, modify, and manage testimonials on your website.

## Overview

The testimonials section is a carousel that displays client feedback about your work. Each testimonial card includes:

1. Person's Photo
2. Person's Name
3. Person's Job Title
4. Person's Company
5. Person's Testimony about you

## Adding New Testimonials

### Method 1: Using JavaScript Functions

You can add new testimonials programmatically using the `addTestimonial` function:

```javascript
addTestimonial(
    "Client Name",           // Person's name
    "Job Title",             // Person's job title
    "Company Name",           // Person's company
    "Testimonial text...",      // The testimonial
    "path/to/photo.jpg"      // Path to person's photo (optional)
);
```

Example:
```javascript
addTestimonial(
    "Sarah Johnson",
    "Creative Director",
    "Design Studio Pro",
    "Ellie's work exceeded our expectations. Her attention to detail and creative vision transformed our brand completely!",
    "./assets/clients/sarah.jpg"
);
```

### Method 2: Direct HTML Addition

You can also add testimonials directly in the HTML by duplicating an existing card:

```html
<div class="testimonial-card">
    <div class="testimonial-photo">
        <img src="./assets/testimonial-placeholder.jpg" alt="Client Photo">
    </div>
    <div class="testimonial-content">
        <div class="testimonial-info">
            <h3 class="testimonial-name">Client Name</h3>
            <p class="testimonial-title">Job Title</p>
            <p class="testimonial-company">Company Name</p>
        </div>
        <div class="testimonial-testimony">
            <p>"Client testimonial text goes here..."</p>
        </div>
        <div class="testimonial-rating">
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
        </div>
    </div>
</div>
```

## Customizing Testimonials

### Changing Photos

Replace `src="./assets/testimonial-placeholder.jpg"` with the path to your client's photo:

```html
<img src="./path/to/client-photo.jpg" alt="Client Name - Job Title at Company">
```

### Modifying Content

Simply update the text content in the appropriate elements:
- `.testimonial-name`: Client's name
- `.testimonial-title`: Job title
- `.testimonial-company`: Company name
- `.testimonial-testimony p`: The testimonial text

### Adjusting Ratings

The rating system uses 5 stars. To change the rating, modify the number of filled stars:

```html
<div class="testimonial-rating">
    <!-- 4-star rating example -->
    <span class="star">★</span>
    <span class="star">★</span>
    <span class="star">★</span>
    <span class="star">★</span>
    <span class="star" style="opacity: 0.3">★</span>
</div>
```

## Styling

The testimonials use the following CSS classes for styling:
- `.testimonialsContainer`: Main container
- `.testimonialsTitle`: Section title
- `.testimonials-carousel`: Carousel wrapper
- `.carousel-track`: Container for testimonial cards
- `.testimonial-card`: Individual testimonial card
- `.testimonial-photo`: Photo container
- `.testimonial-content`: Content wrapper
- `.testimonial-info`: Person's details
- `.testimonial-testimony`: The testimonial text
- `.testimonial-rating`: Star rating

## Navigation

The carousel includes navigation arrows:
- Left arrow (`❮`): Moves carousel left
- Right arrow (`❯`): Moves carousel right

## Responsive Design

The testimonials section is fully responsive:
- Desktop: Shows 3+ cards with navigation
- Tablet: Adjusts card size and spacing
- Mobile: Optimized for smaller screens with touch support

## Best Practices

1. **Use high-quality photos**: Recommended size is at least 200x200px
2. **Keep testimonials concise**: Aim for 2-3 sentences
3. **Maintain consistency**: Use similar formatting for all testimonials
4. **Get permission**: Always ask clients before using their photos and testimonials
5. **Update regularly**: Add new testimonials as you receive them

## Troubleshooting

If testimonials aren't displaying correctly:

1. Check that all image paths are correct
2. Verify HTML structure matches the template
3. Ensure JavaScript functions are properly loaded
4. Check browser console for any error messages