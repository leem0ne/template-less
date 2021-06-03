<?php
  get_header();

  // Start the Loop.
  while ( have_posts() ) :
    the_post(); 
?>

<?= clearPhone(get_custom('custom_phone')) ?><br>
<?= get_custom('custom_phone') ?>

<?php endwhile; // End the loop. 
  get_footer();
?>