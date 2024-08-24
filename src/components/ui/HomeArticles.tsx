import { Carousel, Col, Row } from 'antd';
import articles from './articles.json'; // Ensure this path is correct
import { useMediaQuery } from 'react-responsive';
import ArticleCard from './Article.Card';

interface SubTitle {
    subcoverImgURL?: string;
    Text: string;
}

interface Article {
    Title: string;
    CoverImageUrl: string;
    SubTitle1: SubTitle[]; // Make sure the naming matches your JSON file
    SubTitle2?: SubTitle[];
}

// Utility function to batch products based on the number of items per carousel
const batchArticles = (articles: Article[], itemsPerBatch: number) => {
    const batches = [];
    for (let i = 0; i < articles.length; i += itemsPerBatch) {
        batches.push(articles.slice(i, i + itemsPerBatch));
    }
    return batches;
};

const HomeArticles = () => {
    // Define number of products per carousel for different screen sizes
    const productsPerCarousel = {
        xs: 1, // 1 product per carousel on extra small screens (mobile)
        sm: 1, // 1 product per carousel on small screens (tablets)
        md: 2, // 2 products per carousel on medium screens (desktops)
        lg: 4, // 4 products per carousel on large screens (large desktops)
    };

    // Use media queries to determine the screen size
    const isTablet = useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1025px) and (max-width: 1440px)' });
    const isLargeDesktop = useMediaQuery({ query: '(min-width: 1441px)' });

    // Determine the number of products per carousel based on the screen size
    let numArticlesPerCarousel;
    if (isLargeDesktop) {
        numArticlesPerCarousel = productsPerCarousel.lg;
    } else if (isDesktop) {
        numArticlesPerCarousel = productsPerCarousel.md;
    } else if (isTablet) {
        numArticlesPerCarousel = productsPerCarousel.md;
    } else {
        numArticlesPerCarousel = productsPerCarousel.xs;
    }

    // Set margin based on screen size
    const marginStyle = isTablet || isDesktop ? '0 2%' : '0';

    // Create batches based on the number of products per carousel
    const carousels = batchArticles(articles, numArticlesPerCarousel);

    return (
        <div>
            <Carousel autoplay>
                {carousels.map((batch, index) => (
                    <div key={index}>
                        <Row gutter={[24, 24]} justify="center">
                            {batch.map((article, idx) => (
                                <Col
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: marginStyle, // Apply conditional margin
                                    }}
                                    key={idx}
                                    xs={24} // 1 column on extra small screens (mobile)
                                    sm={12} // 2 columns on small screens (tablets)
                                    md={8}  // 3 columns on medium screens (desktops)
                                    lg={6}  // 4 columns on large screens (large desktops)
                                >
                                    <ArticleCard article={article} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HomeArticles;
