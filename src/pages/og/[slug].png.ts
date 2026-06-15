import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const fontBold = readFileSync(resolve('src/assets/fonts/Inter-Bold.ttf'));
const fontRegular = readFileSync(resolve('src/assets/fonts/Inter-Regular.ttf'));

const ACCENT = '#4B9EFF';
const BG = '#0A0A0A';
const SURFACE = '#111111';
const TEXT = '#E8E8E8';
const MUTED = '#444444';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
      category: post.data.category ?? 'Performance Marketing',
      date: post.data.date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, category, date } = props;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          background: BG,
          display: 'flex',
          fontFamily: 'Inter',
          position: 'relative',
        },
        children: [

          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: '0',
                top: '0',
                width: '5px',
                height: '100%',
                background: ACCENT,
              },
            },
          },

          // Top accent line
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '1px',
                background: '#1E1E1E',
              },
            },
          },

          // Background grid pattern (subtle dots)
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: '0',
                top: '0',
                width: '420px',
                height: '100%',
                background: SURFACE,
                opacity: 0.4,
              },
            },
          },

          // Large faded "3" watermark
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                right: '60px',
                bottom: '-40px',
                fontSize: '320px',
                fontWeight: 800,
                color: ACCENT,
                opacity: 0.06,
                letterSpacing: '-0.05em',
                lineHeight: 1,
              },
              children: '3',
            },
          },

          // Main content
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '56px 72px 52px 80px',
              },
              children: [

                // Top: category + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '12px',
                            fontWeight: 700,
                            color: ACCENT,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            background: '#0D1F36',
                            padding: '5px 12px',
                            border: '1px solid #1a3a6b',
                          },
                          children: category,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '12px',
                            color: MUTED,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                          children: date,
                        },
                      },
                    ],
                  },
                },

                // Middle: title + description
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      maxWidth: '780px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: title.length > 45 ? '46px' : '54px',
                            fontWeight: 800,
                            color: TEXT,
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                          },
                          children: title,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '17px',
                            fontWeight: 400,
                            color: '#666666',
                            lineHeight: 1.5,
                            maxWidth: '640px',
                          },
                          children: description,
                        },
                      },
                    ],
                  },
                },

                // Bottom: logo + url
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0px',
                            fontSize: '20px',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                          },
                          children: [
                            { type: 'span', props: { style: { color: TEXT }, children: 'FONS' } },
                            { type: 'span', props: { style: { color: ACCENT }, children: '3' } },
                            { type: 'span', props: { style: { color: TEXT }, children: 'CA' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '13px',
                            color: '#2a2a2a',
                            letterSpacing: '0.06em',
                          },
                          children: 'fons3ca.com',
                        },
                      },
                    ],
                  },
                },

              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontBold, weight: 800, style: 'normal' },
        { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};
